import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateActivity() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        imageUrl: "",
    });

    const base = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.description) {
            setError("Name and description are required.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                `${base}/api/activities`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to create activity. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.logo} onClick={() => navigate("/")}>Care Connect</h1>
                    <button onClick={() => navigate("/")} style={styles.backButton}>
                        ← Back to Home
                    </button>
                </div>
            </div>

            <div style={styles.formContainer}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Create New Activity</h2>
                    <p style={styles.subtitle}>Fill in the details to create a new volunteer activity</p>

                    {error && <div style={styles.errorBanner}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="name">Activity Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="e.g., Beach Cleanup Day"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ ...styles.input, ...styles.textarea }}
                                placeholder="Describe the activity..."
                                rows="5"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="location">Location</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="e.g., Ancol Beach, Jakarta"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="date">Date</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="imageUrl">Image URL</label>
                            <input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div style={styles.buttonGroup}>
                            <button 
                                type="button" 
                                onClick={() => navigate("/")} 
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                style={{ ...styles.submitButton, ...(loading ? styles.buttonDisabled : {}) }}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Activity"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
    },
    headerContent: {
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: 24,
        fontWeight: 700,
        color: '#047857',
        margin: 0,
        cursor: 'pointer',
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#FFFFFF',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 14,
    },
    formContainer: {
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 24px',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        margin: '0 0 8px 0',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        margin: '0 0 24px 0',
    },
    errorBanner: {
        padding: '12px 16px',
        backgroundColor: '#FEF2F2',
        color: '#B91C1C',
        borderRadius: 8,
        marginBottom: 24,
        fontSize: 14,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        fontSize: 14,
        outline: 'none',
        fontFamily: 'inherit',
    },
    textarea: {
        resize: 'vertical',
        minHeight: 120,
    },
    buttonGroup: {
        display: 'flex',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        padding: '12px 24px',
        backgroundColor: '#FFFFFF',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 14,
    },
    submitButton: {
        flex: 1,
        padding: '12px 24px',
        backgroundColor: '#047857',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 14,
    },
    buttonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
};
