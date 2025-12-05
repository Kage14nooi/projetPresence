import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PDFRapportEtudiantProps {
  data: any;
}

const PDFRapportEtudiant: React.FC<PDFRapportEtudiantProps> = ({ data }) => {
  const tauxAbsenceGlobal = (
    (data.resume.total_absences_completes /
      (data.resume.total_absences_completes + data.resume.total_presences)) *
    100
  ).toFixed(2);

  const getAlerteNiveau = (tauxAbsence: string) => {
    const taux = parseFloat(tauxAbsence);
    if (taux >= 50) return { niveau: "CRITIQUE", color: "#ef4444" };
    if (taux >= 35) return { niveau: "ÉLEVÉ", color: "#f97316" };
    if (taux >= 25) return { niveau: "ATTENTION", color: "#eab308" };
    return { niveau: "NORMAL", color: "#22c55e" };
  };

  const alerte = getAlerteNiveau(tauxAbsenceGlobal);

  return (
    <div id="pdf-rapport" style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `}</style>

      {/* En-tête du rapport */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.logo}>
              <div style={styles.logoCircle}>📚</div>
              <div>
                <h3 style={styles.institutionName}>Institut Supérieur</h3>
                <p style={styles.institutionSubtitle}>Suivi Académique</p>
              </div>
            </div>
          </div>
          <div style={styles.headerRight}>
            <p style={styles.reportTitle}>RAPPORT DE SUIVI</p>
            <p style={styles.reportDate}>
              {new Date(data.date_generation).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p style={styles.reportNumber}>
              N° {data.etudiant.etudiant_matricule}
            </p>
          </div>
        </div>
        <div style={styles.headerDivider}></div>
      </div>

      {/* Informations Étudiant */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>INFORMATIONS DE L'ÉTUDIANT</h2>
        <div style={styles.studentInfo}>
          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Nom complet:</span>
              <span style={styles.infoValue}>
                {data.etudiant.etudiant_prenom} {data.etudiant.etudiant_nom}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Matricule:</span>
              <span style={styles.infoValue}>
                {data.etudiant.etudiant_matricule}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email:</span>
              <span style={styles.infoValue}>
                {data.etudiant.etudiant_mail}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Parcours:</span>
              <span style={styles.infoValue}>
                {data.etudiant.parcour?.parcours_nom || "N/A"}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Mention:</span>
              <span style={styles.infoValue}>
                {data.etudiant.mention?.mention_nom || "N/A"}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Niveau:</span>
              <span style={styles.infoValue}>
                {data.etudiant.niveau?.niveau_nom || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé Exécutif */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>RÉSUMÉ EXÉCUTIF</h2>
        <div style={styles.executiveSummary}>
          <div style={styles.alertBox}>
            <div
              style={{
                ...styles.alertIndicator,
                backgroundColor: alerte.color,
              }}
            >
              <span style={styles.alertLevel}>{alerte.niveau}</span>
            </div>
            <div style={styles.alertDetails}>
              <p style={styles.alertText}>Niveau d'alerte assiduité</p>
              <p style={styles.alertRate}>
                Taux d'absence: {tauxAbsenceGlobal}%
              </p>
            </div>
          </div>

          <div style={styles.metricsGrid}>
            <div style={{ ...styles.metricCard, borderLeftColor: "#ef4444" }}>
              <p style={styles.metricValue}>
                {data.resume.total_absences_completes}
              </p>
              <p style={styles.metricLabel}>Absences</p>
            </div>
            <div style={{ ...styles.metricCard, borderLeftColor: "#f97316" }}>
              <p style={styles.metricValue}>{data.resume.total_retards}</p>
              <p style={styles.metricLabel}>Retards</p>
            </div>
            <div style={{ ...styles.metricCard, borderLeftColor: "#22c55e" }}>
              <p style={styles.metricValue}>{data.resume.total_presences}</p>
              <p style={styles.metricLabel}>Présences</p>
            </div>
            <div style={{ ...styles.metricCard, borderLeftColor: "#6366f1" }}>
              <p style={styles.metricValue}>{data.resume.score_regularite}</p>
              <p style={styles.metricLabel}>Score de régularité</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par Matière */}
      {data.statistiques_par_matiere &&
        data.statistiques_par_matiere.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>DÉTAILS PAR MATIÈRE</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.tableHeader, textAlign: "left" }}>
                      Matière
                    </th>
                    <th style={styles.tableHeader}>Absences</th>
                    <th style={styles.tableHeader}>Retards</th>
                    <th style={styles.tableHeader}>Présences</th>
                    <th style={styles.tableHeader}>Heures perdues</th>
                    <th style={styles.tableHeader}>% Absence</th>
                    <th style={styles.tableHeader}>% Présence</th>
                  </tr>
                </thead>
                <tbody>
                  {data.statistiques_par_matiere.map(
                    (stat: any, index: number) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={{ ...styles.tableCell, fontWeight: 600 }}>
                          {stat.matiere_nom}
                        </td>
                        <td style={styles.tableCell}>
                          <span style={{ ...styles.badge, ...styles.badgeRed }}>
                            {stat.absences}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span
                            style={{ ...styles.badge, ...styles.badgeOrange }}
                          >
                            {stat.retards}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span
                            style={{ ...styles.badge, ...styles.badgeGreen }}
                          >
                            {stat.presences}
                          </span>
                        </td>
                        <td style={{ ...styles.tableCell, fontWeight: 600 }}>
                          {stat.heures_perdues}h
                        </td>
                        <td
                          style={{
                            ...styles.tableCell,
                            color: "#dc2626",
                            fontWeight: 600,
                          }}
                        >
                          {stat.pourcentage_absence}%
                        </td>
                        <td
                          style={{
                            ...styles.tableCell,
                            color: "#16a34a",
                            fontWeight: 600,
                          }}
                        >
                          {stat.pourcentage_presence}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Graphique */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>VISUALISATION DES DONNÉES</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.statistiques_par_matiere}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="matiere_nom"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="presences"
                fill="#22c55e"
                name="Présences"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="absences"
                fill="#ef4444"
                name="Absences"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="retards"
                fill="#f97316"
                name="Retards"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historique des incidents */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>HISTORIQUE DES INCIDENTS</h2>
        <div style={styles.historyGrid}>
          {/* Absences */}
          <div style={styles.historyColumn}>
            <h3 style={styles.historyTitle}>Absences récentes</h3>
            <div style={styles.historyList}>
              {data.details_absences && data.details_absences.length > 0 ? (
                data.details_absences
                  .slice(0, 5)
                  .map((abs: any, index: number) => (
                    <div key={index} style={styles.historyItem}>
                      <div style={styles.historyItemHeader}>
                        <span style={styles.historyItemTitle}>
                          {abs.matiere}
                        </span>
                        <span
                          style={{
                            ...styles.historyItemBadge,
                            backgroundColor: "#fef2f2",
                            color: "#991b1b",
                          }}
                        >
                          {abs.heure_debut} - {abs.heure_fin}
                        </span>
                      </div>
                      <p style={styles.historyItemDate}>
                        {new Date(abs.date).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))
              ) : (
                <p style={styles.noData}>Aucune absence enregistrée</p>
              )}
            </div>
          </div>

          {/* Retards */}
          <div style={styles.historyColumn}>
            <h3 style={styles.historyTitle}>Retards récents</h3>
            <div style={styles.historyList}>
              {data.details_retards && data.details_retards.length > 0 ? (
                data.details_retards
                  .slice(0, 5)
                  .map((ret: any, index: number) => (
                    <div key={index} style={styles.historyItem}>
                      <div style={styles.historyItemHeader}>
                        <span style={styles.historyItemTitle}>
                          {ret.matiere}
                        </span>
                        <span
                          style={{
                            ...styles.historyItemBadge,
                            backgroundColor: "#fff7ed",
                            color: "#9a3412",
                          }}
                        >
                          {ret.heure_debut} - {ret.heure_fin}
                        </span>
                      </div>
                      <p style={styles.historyItemDate}>
                        {new Date(ret.date).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))
              ) : (
                <p style={styles.noData}>Aucun retard enregistré</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>RECOMMANDATIONS</h2>
        <div style={styles.recommendations}>
          {parseFloat(tauxAbsenceGlobal) >= 25 && (
            <div style={styles.recommendation}>
              <span style={styles.recommendationIcon}>⚠️</span>
              <p style={styles.recommendationText}>
                Convocation recommandée - Taux d'absence critique dépassant le
                seuil réglementaire de 25%
              </p>
            </div>
          )}
          {parseFloat(data.resume.score_regularite) < 70 && (
            <div style={styles.recommendation}>
              <span style={styles.recommendationIcon}>📉</span>
              <p style={styles.recommendationText}>
                Score de régularité faible - Un suivi rapproché et un
                accompagnement personnalisé sont nécessaires
              </p>
            </div>
          )}
          {data.resume.total_retards > 5 && (
            <div style={styles.recommendation}>
              <span style={styles.recommendationIcon}>⏰</span>
              <p style={styles.recommendationText}>
                Nombre de retards élevé - Sensibilisation à la ponctualité et à
                l'importance de l'assiduité
              </p>
            </div>
          )}
          {data.resume.heures_perdues > 20 && (
            <div style={styles.recommendation}>
              <span style={styles.recommendationIcon}>📊</span>
              <p style={styles.recommendationText}>
                Volume d'heures perdues important ({data.resume.heures_perdues}
                h) - Impact potentiel sur la validation du semestre
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pied de page */}
      <div style={styles.footer}>
        <div style={styles.footerDivider}></div>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            Ce rapport a été généré automatiquement par le système de suivi
            académique
          </p>
          <p style={styles.footerText}>
            Document confidentiel - Usage interne uniquement
          </p>
        </div>
        <div style={styles.signatures}>
          <div style={styles.signatureBlock}>
            <div style={styles.signatureLine}></div>
            <p style={styles.signatureLabel}>Le Responsable Pédagogique</p>
          </div>
          <div style={styles.signatureBlock}>
            <div style={styles.signatureLine}></div>
            <p style={styles.signatureLabel}>Le Directeur des Études</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "210mm",
    minHeight: "297mm",
    backgroundColor: "#ffffff",
    padding: "20mm",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: "8mm",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "4mm",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "3mm",
  },
  logoCircle: {
    width: "15mm",
    height: "15mm",
    borderRadius: "50%",
    backgroundColor: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  institutionName: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "1mm",
  },
  institutionSubtitle: {
    fontSize: "12px",
    color: "#6b7280",
  },
  headerRight: {
    textAlign: "right" as const,
  },
  reportTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#4f46e5",
    marginBottom: "1mm",
    letterSpacing: "0.5px",
  },
  reportDate: {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "1mm",
  },
  reportNumber: {
    fontSize: "10px",
    color: "#9ca3af",
  },
  headerDivider: {
    height: "2px",
    backgroundColor: "#4f46e5",
    borderRadius: "2px",
  },
  section: {
    marginBottom: "8mm",
    pageBreakInside: "avoid" as const,
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "4mm",
    paddingBottom: "2mm",
    borderBottom: "1px solid #e5e7eb",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  studentInfo: {
    backgroundColor: "#f9fafb",
    padding: "4mm",
    borderRadius: "2mm",
    border: "1px solid #e5e7eb",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3mm",
  },
  infoRow: {
    display: "flex",
    gap: "2mm",
  },
  infoLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7280",
    minWidth: "30mm",
  },
  infoValue: {
    fontSize: "11px",
    color: "#1f2937",
    fontWeight: 500,
  },
  executiveSummary: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4mm",
  },
  alertBox: {
    display: "flex",
    alignItems: "center",
    gap: "4mm",
    padding: "4mm",
    backgroundColor: "#fef2f2",
    borderRadius: "2mm",
    border: "1px solid #fecaca",
  },
  alertIndicator: {
    padding: "3mm 4mm",
    borderRadius: "2mm",
    minWidth: "25mm",
    textAlign: "center" as const,
  },
  alertLevel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#ffffff",
  },
  alertDetails: {
    flex: 1,
  },
  alertText: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "1mm",
  },
  alertRate: {
    fontSize: "10px",
    color: "#6b7280",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "3mm",
  },
  metricCard: {
    padding: "4mm",
    backgroundColor: "#ffffff",
    borderRadius: "2mm",
    border: "1px solid #e5e7eb",
    borderLeftWidth: "3px",
    textAlign: "center" as const,
  },
  metricValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "1mm",
  },
  metricLabel: {
    fontSize: "10px",
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
  },
  tableContainer: {
    border: "1px solid #e5e7eb",
    borderRadius: "2mm",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "10px",
  },
  tableHeaderRow: {
    backgroundColor: "#f3f4f6",
  },
  tableHeader: {
    padding: "3mm",
    textAlign: "center" as const,
    fontWeight: 700,
    color: "#374151",
    borderBottom: "2px solid #d1d5db",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  tableCell: {
    padding: "3mm",
    textAlign: "center" as const,
    color: "#1f2937",
  },
  badge: {
    padding: "1mm 2mm",
    borderRadius: "1mm",
    fontSize: "9px",
    fontWeight: 600,
    display: "inline-block",
  },
  badgeRed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  badgeOrange: {
    backgroundColor: "#ffedd5",
    color: "#9a3412",
  },
  badgeGreen: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    padding: "4mm",
    borderRadius: "2mm",
    border: "1px solid #e5e7eb",
  },
  historyGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4mm",
  },
  historyColumn: {
    backgroundColor: "#f9fafb",
    padding: "4mm",
    borderRadius: "2mm",
    border: "1px solid #e5e7eb",
  },
  historyTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "3mm",
  },
  historyList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2mm",
  },
  historyItem: {
    backgroundColor: "#ffffff",
    padding: "2mm",
    borderRadius: "1mm",
    border: "1px solid #e5e7eb",
  },
  historyItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1mm",
  },
  historyItemTitle: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#1f2937",
  },
  historyItemBadge: {
    fontSize: "8px",
    padding: "1mm 2mm",
    borderRadius: "1mm",
    fontWeight: 600,
  },
  historyItemDate: {
    fontSize: "9px",
    color: "#6b7280",
  },
  noData: {
    fontSize: "10px",
    color: "#9ca3af",
    textAlign: "center" as const,
    padding: "3mm",
  },
  recommendations: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "3mm",
  },
  recommendation: {
    display: "flex",
    gap: "3mm",
    padding: "3mm",
    backgroundColor: "#fffbeb",
    borderRadius: "2mm",
    border: "1px solid #fde68a",
  },
  recommendationIcon: {
    fontSize: "16px",
    lineHeight: 1,
  },
  recommendationText: {
    fontSize: "10px",
    color: "#1f2937",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "10mm",
    pageBreakInside: "avoid" as const,
  },
  footerDivider: {
    height: "1px",
    backgroundColor: "#d1d5db",
    marginBottom: "4mm",
  },
  footerContent: {
    textAlign: "center" as const,
    marginBottom: "8mm",
  },
  footerText: {
    fontSize: "9px",
    color: "#6b7280",
    marginBottom: "1mm",
  },
  signatures: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10mm",
  },
  signatureBlock: {
    textAlign: "center" as const,
    minWidth: "40mm",
  },
  signatureLine: {
    height: "15mm",
    borderBottom: "1px solid #9ca3af",
    marginBottom: "2mm",
  },
  signatureLabel: {
    fontSize: "9px",
    color: "#6b7280",
    fontWeight: 600,
  },
};

export default PDFRapportEtudiant;
