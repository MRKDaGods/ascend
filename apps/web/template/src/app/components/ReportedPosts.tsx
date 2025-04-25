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
} from "@mui/material";

type Status = "pending" | "reviewed" | "resolved" | "rejected";

export default function ReportedPostCard({
  report,
  onDelete,
  onUpdateStatus,
}: {
  report: any;
  onDelete: (postId: number) => void;
  onUpdateStatus: (reportId: number, status: Status) => void;
}) {
  return (
    <Card sx={{ display: "flex", p: 2 }}>
      {/* Media */}
      {report.post.media.length > 0 && (
        <CardMedia
          component="img"
          sx={{ width: 160, height: 160, borderRadius: 2 }}
          image={report.post.media[0].url}
          alt={report.post.media[0].title}
        />
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {report.post.user.first_name} {report.post.user.last_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Post:</strong> {report.post.content}
        </Typography>
        <Typography variant="body2">
          <strong>Reason:</strong> {report.reason}
        </Typography>
        <Typography variant="body2" mb={1}>
          <strong>Description:</strong> {report.description}
        </Typography>

        <Stack direction="row" spacing={2} mt={2}>
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
