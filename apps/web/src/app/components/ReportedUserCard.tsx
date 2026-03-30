"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";

export default function ReportedUserCard({
  report, //report itself
  onBanUser,
  onDeleteUser,
  onDeleteReport,
}: {
  report: any;
  onBanUser: (reportId:number, userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onDeleteReport: (reportId: number) => void;
}) {
  return (
    <Card sx={{ display: "flex", p: 2 }}>
      {report.reported.profile_picture_url && (
        <CardMedia
          component="img"
          image={report.reported.profile_picture_url}
          alt={report.reported.first_name || "user profile picture"}
          sx={{ width: 60, height: 60, borderRadius: 2 }}
        />
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {report.reported.first_name} {report.reported.last_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {report.reported.contact_info.email}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Reason:</strong> {report.reason}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onBanUser(report.id, report.reported_id)}
          sx={{ mt: 1, mr: 1 }}
        >
          Ban User
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDeleteUser(report.reported_id)}
          sx={{ mt: 1, mr: 1 }}
        >
          Delete User
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDeleteReport(report.id)}
          sx={{ mt: 1 }}
        >
          Delete Report
        </Button>
      </CardContent>
    </Card>
  );
}
