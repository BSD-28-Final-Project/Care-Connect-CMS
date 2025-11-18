import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ActivityDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const base = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);
        fetchActivity();
    }, [id]);

    const fetchActivity = async () => {
        try {
            const res = await axios.get(`${base}/api/activities/${id}`);
            setActivity(res.data.data || res.data);
        } catch (err) {
            console.error("Failed to fetch activity:", err);
            setError("Failed to load activity details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this activity?")) {
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${base}/api/activities/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/");
        } catch (err) {
            console.error("Failed to delete activity:", err);
            alert(err?.response?.data?.message || "Failed to delete activity.");
        }
    };

    if (loading) {
        return (
            <div style={styles.centered}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading activity...</p>
            </div>
        );
    }

    if (error || !activity) {
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
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error || "Activity not found"}</p>
                    <button onClick={() => navigate("/")} style={styles.homeButton}>
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

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

            <div style={styles.content}>
                {activity.imageUrl && (
                    <div style={styles.imageContainer}>
                        <img 
                            src={activity.imageUrl} 
                            alt={activity.name}
                            style={styles.image}
                        />
                    </div>
                )}

                <div style={styles.detailCard}>
                    <div style={styles.detailHeader}>
                        <div>
                            <h1 style={styles.title}>{activity.name}</h1>
                            <div style={styles.metaInfo}>
                                {activity.location && (
                                    <div style={styles.metaItem}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span style={styles.metaText}>
                                            {typeof activity.location === 'string' 
                                                ? activity.location 
                                                : activity.location?.name || 'Location TBA'}
                                        </span>
                                    </div>
                                )}
                                {activity.date && (
                                    <div style={styles.metaItem}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="6" width="18" height="15" rx="2" stroke="#6B7280" strokeWidth="2"/>
                                            <path d="M3 10H21M8 3V6M16 3V6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <span style={styles.metaText}>
                                            {new Date(activity.date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {isLoggedIn && (
                            <div style={styles.adminActions}>
                                <button 
                                    onClick={() => navigate(`/edit-activity/${id}`)} 
                                    style={styles.editButton}
                                >
                                    Edit
                                </button>
                                <button onClick={handleDelete} style={styles.deleteButton}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Description</h2>
                        <p style={styles.description}>{activity.description}</p>
                    </div>

                    {activity.volunteers && activity.volunteers.length > 0 && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Volunteers ({activity.volunteers.length})
                            </h2>
                            <div style={styles.volunteerList}>
                                {activity.volunteers.map((volunteer, index) => (
                                    <div key={index} style={styles.volunteerCard}>
                                        <div style={styles.volunteerAvatar}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p style={styles.volunteerName}>
                                                {volunteer.name || volunteer.username || volunteer.email || 'Volunteer'}
                                            </p>
                                            {volunteer.email && (
                                                <p style={styles.volunteerEmail}>{volunteer.email}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activity.donations && activity.donations.length > 0 && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                Donations ({activity.donations.length})
                            </h2>
                            <div style={styles.donationList}>
                                {activity.donations.map((donation, index) => (
                                    <div key={index} style={styles.donationCard}>
                                        <div style={styles.donationInfo}>
                                            <p style={styles.donorName}>
                                                {donation.donorName || 'Anonymous'}
                                            </p>
                                            <p style={styles.donationAmount}>
                                                Rp {donation.amount?.toLocaleString('id-ID') || '0'}
                                            </p>
                                        </div>
                                        {donation.message && (
                                            <p style={styles.donationMessage}>{donation.message}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
    centered: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
    },
    spinner: {
        width: 48,
        height: 48,
        border: '4px solid #E5E7EB',
        borderTop: '4px solid #047857',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 14,
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 10,
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
    errorContainer: {
        maxWidth: 600,
        margin: '64px auto',
        padding: '24px',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        marginBottom: 24,
    },
    homeButton: {
        padding: '12px 24px',
        backgroundColor: '#047857',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 14,
    },
    content: {
        maxWidth: 1024,
        margin: '0 auto',
        padding: '32px 24px',
    },
    imageContainer: {
        width: '100%',
        height: 400,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 32,
        backgroundColor: '#E5E7EB',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    detailCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    detailHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
        paddingBottom: 24,
        borderBottom: '1px solid #E5E7EB',
    },
    title: {
        fontSize: 32,
        fontWeight: 700,
        color: '#111827',
        margin: '0 0 16px 0',
    },
    metaInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    metaText: {
        fontSize: 15,
        color: '#6B7280',
    },
    adminActions: {
        display: 'flex',
        gap: 12,
    },
    editButton: {
        padding: '10px 20px',
        backgroundColor: '#047857',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 14,
    },
    deleteButton: {
        padding: '10px 20px',
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 14,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: '#111827',
        margin: '0 0 16px 0',
    },
    description: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 1.7,
        margin: 0,
        whiteSpace: 'pre-wrap',
    },
    volunteerList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 16,
    },
    volunteerCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
    },
    volunteerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ECFDF5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    volunteerName: {
        fontSize: 14,
        fontWeight: 600,
        color: '#111827',
        margin: '0 0 4px 0',
    },
    volunteerEmail: {
        fontSize: 13,
        color: '#6B7280',
        margin: 0,
    },
    donationList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    donationCard: {
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
    },
    donationInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    donorName: {
        fontSize: 14,
        fontWeight: 600,
        color: '#111827',
        margin: 0,
    },
    donationAmount: {
        fontSize: 16,
        fontWeight: 700,
        color: '#047857',
        margin: 0,
    },
    donationMessage: {
        fontSize: 13,
        color: '#6B7280',
        margin: 0,
        fontStyle: 'italic',
    },
};
