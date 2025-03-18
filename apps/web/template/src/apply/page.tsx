import { useRouter } from "next/navigation";
import { Button, Typography } from "@mui/material";

const ApplyPage = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4">Apply for Jobs</Typography>
      <Typography variant="body1">List of jobs will be displayed here.</Typography>
      <Button variant="contained" onClick={() => router.push("/")}>Go Back</Button>
    </div>
  );
};

export default ApplyPage;
