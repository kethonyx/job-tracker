import { useDeferredValue, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import API from "../api/axios";
import Layout from "../components/Layout";
import type { Company, CompanyPage, CompanyStatus, User } from "../types";

const statusOptions: CompanyStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

const defaultForm = {
  name: "",
  position: "",
  status: "APPLIED" as CompanyStatus,
};

const statusLabels: Record<CompanyStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success">("success");

  const loadCompanies = async (
    targetPage: number,
    options?: {
      signal?: AbortSignal;
      silent?: boolean;
    },
  ) => {
    const { signal, silent = false } = options ?? {};

    if (!silent) {
      setIsLoading(true);
    }

    try {
      const response = await API.get<CompanyPage>("/companies/my", {
        params: {
          page: targetPage,
          size: 6,
          ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
          ...(deferredSearch ? { search: deferredSearch } : {}),
        },
        signal,
      });

      setCompanies(response.data.content);
      setTotalPages(Math.max(response.data.totalPages, 1));
      setTotalElements(response.data.totalElements);
    } catch (error) {
      if (!axios.isCancel(error) && !signal?.aborted) {
        console.error(error);
        setFeedback("We couldn't load your applications right now.");
        setFeedbackTone("error");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadUser = async () => {
      try {
        const response = await API.get<User>("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    };

    void loadUser();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const controller = new AbortController();
    void loadCompanies(page, { signal: controller.signal });

    return () => controller.abort();
  }, [deferredSearch, page, statusFilter, token]);

  useEffect(() => {
    setPage(0);
  }, [deferredSearch, statusFilter]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFeedback("");

    try {
      await API.post("/companies", form);
      setForm(defaultForm);
      setFeedback("Application added successfully.");
      setFeedbackTone("success");
      if (page !== 0) {
        setPage(0);
      } else {
        await loadCompanies(0, { silent: true });
      }
    } catch (error) {
      console.error(error);
      setFeedback("Couldn't add the application. Check the backend and try again.");
      setFeedbackTone("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/companies/${id}`);
      setFeedback("Application removed.");
      setFeedbackTone("success");

      const nextPage = companies.length === 1 && page > 0 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadCompanies(nextPage, { silent: true });
      }
    } catch (error) {
      console.error(error);
      setFeedback("Delete failed. Please try again.");
      setFeedbackTone("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const statusCounts = statusOptions.reduce<Record<CompanyStatus, number>>(
    (accumulator, status) => {
      accumulator[status] = companies.filter((company) => company.status === status).length;
      return accumulator;
    },
    {
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    },
  );

  return (
    <Layout onLogout={handleLogout} user={user}>
      <div className="dashboard-grid">
        <section className="panel panel-accent panel-summary">
          <div className="section-heading section-heading-compact">
            <div>
              <p className="eyebrow">Pipeline snapshot</p>
              <h2>{totalElements} tracked applications</h2>
              <p className="subtle panel-subtitle">
                Keep your current pipeline visible and spot bottlenecks faster.
              </p>
            </div>
            <span className="pill">Page {page + 1}</span>
          </div>

          <div className="stats-grid">
            {statusOptions.map((status) => (
              <div className="metric-card" key={status}>
                <span>{statusLabels[status]}</span>
                <strong>{statusCounts[status]}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel panel-form">
          <div className="section-heading section-heading-compact">
            <div>
              <p className="eyebrow">Add new company</p>
              <h2>Capture the next application</h2>
              <p className="subtle panel-subtitle">
                Save the company, role, and stage while the details are still fresh.
              </p>
            </div>
          </div>

          <form className="stack" onSubmit={handleCreate}>
            <label className="field">
              <span>Company</span>
              <input
                className="input"
                placeholder="Stripe"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Position</span>
              <input
                className="input"
                placeholder="Frontend Engineer"
                value={form.position}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    position: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Status</span>
              <select
                className="input"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as CompanyStatus,
                  }))
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </label>

            <button className="button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Add application"}
            </button>
          </form>
        </section>

        <section className="panel panel-wide panel-applications">
          <div className="section-heading section-heading-wrap">
            <div>
              <p className="eyebrow">Applications</p>
              <h2>Review and filter your pipeline</h2>
              <p className="subtle panel-subtitle">
                Search by company or narrow the list by stage.
              </p>
            </div>

            <div className="filters">
              <input
                className="input search-input"
                placeholder="Search company name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                className="input filter-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as CompanyStatus | "ALL")
                }
              >
                <option value="ALL">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {feedback ? (
            <div className={`banner ${feedbackTone === "success" ? "banner-success" : "banner-error"}`}>
              {feedback}
            </div>
          ) : null}

          {isLoading ? (
            <div className="empty-state">Loading your applications...</div>
          ) : companies.length === 0 ? (
            <div className="empty-state">
              No applications yet. Add one above to start tracking.
            </div>
          ) : (
            <div className="card-list">
              {companies.map((company) => (
                <article className="company-card" key={company.id}>
                  <div>
                    <div className="company-card-top">
                      <h3>{company.name}</h3>
                      <span className={`status-badge status-${company.status.toLowerCase()}`}>
                        {statusLabels[company.status]}
                      </span>
                    </div>
                    <p>{company.position}</p>
                  </div>

                  <button
                    className="button button-ghost"
                    onClick={() => handleDelete(company.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              className="button button-ghost"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(current - 1, 0))}
              type="button"
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="button button-ghost"
              disabled={page + 1 >= totalPages}
              onClick={() =>
                setPage((current) => (current + 1 < totalPages ? current + 1 : current))
              }
              type="button"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
