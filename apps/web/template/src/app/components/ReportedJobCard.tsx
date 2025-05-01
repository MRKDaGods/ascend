"use client";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CardMedia,
} from "@mui/material";

type Status = "pending" | "reviewed" | "resolved" | "rejected";

export default function ReportedJobCard({
  report,
  onDelete,
  onUpdateStatus,
}: {
  report: any;
  onDelete: (jobId: number) => void;
  onUpdateStatus: (reportId: number, status: Status) => void;
}) {
  return (
    <Card sx={{ display: "flex", p: 2 }}>
      {/*company logo*/}
      {report.job.company_logo_url && (
        <CardMedia
          component="img"
          image={report.job.company_logo_url}
          alt={report.job.company_name || "Company logo"}
          sx={{ width: 60, height: 60, borderRadius: 2 }}
        />
      )}

      {/*report info*/}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {report.job.title} - {report.job.company_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {report.job.location} | {report.job.type} |{" "}
          {report.job.experience_level}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {report.job.salary_min_range} - {report.job.salary_max_range} $
        </Typography>
        <Typography variant="body2">
          <strong>Reason:</strong> {report.reason}
        </Typography>

        {/*report controls*/}
        <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(report.job.job_id)}
          >
            Delete Job
          </Button>

          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              value={report.status}
              label="Status"
              onChange={(e) =>
                onUpdateStatus(report.id, e.target.value as Status)
              }
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
