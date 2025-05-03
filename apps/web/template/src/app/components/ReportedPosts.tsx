"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box
} from "@mui/material";

type Status = "pending" | "reviewed" | "resolved" | "rejected";

export default function ReportedPostCard({
  report,
  onDelete,
  onUpdateStatus,
  fetchReportDetails
}: {
  report: any;
  onDelete: (postId: number) => void;
  onUpdateStatus: (reportId: number, status: Status) => void;
  fetchReportDetails: (postId: number) => void;
}) {
  return (
    <Box position="relative">
    <Card sx={{ display: "flex", p: 2 }}>
    <Button
      onClick={() => fetchReportDetails(report.id)}
      sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
      size="small"
      variant="outlined"
    >
      View Reports
    </Button>

      {/*post Media */}
      {report.media.length > 0 && (
        <CardMedia
          component="img"
          sx={{ width: 160, height: 160, borderRadius: 2 }}
          image={report.media[0].url}
          // alt={report.media[0].title}
        />
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {report.user.first_name} {report.user.last_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Post:</strong> {report.content}
        </Typography>
        {/* <Typography variant="body2">
          <strong>Reason:</strong> {report.reason}
        </Typography> */}
        {/* <Typography variant="body2" mb={1}>
          <strong>Description:</strong> {report.description}
        </Typography> */}

        {/* <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(report.post.id)}
          >
            Delete Post
          </Button>

          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={report.status}
              label="Status"
              onChange={(e) =>
              onUpdateStatus(report.id, e.target.value as Status)
              }
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack> */}
      </CardContent>
    </Card>
    </Box>
  );
}
