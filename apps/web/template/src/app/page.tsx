import styles from "./page.module.css";
import JobPreferences from "./components/lookingfor";
import Navbar from "./components/navbar";
import ProfileCard from "./components/ProfileCard";
import JobPicks from "./components/JobPicks"; 
import Recommends from "./components/recommends";
import ListCard from "./components/ListCard";
import JobList from "./components/JobsList";
function Home() {
  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "20px",
          paddingLeft: "60px",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Left Column: Profile & Jobs */}
        <div style={{ flexShrink: 0, width: "fit-content", display: "flex", flexDirection: "column", gap: "20px" }}>
          <ProfileCard />
          <ListCard />
        </div>

        {/* Right Column: Job Preferences & Job Picks */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "left", width: "100%" }}>
  <div style={{ width: "100%", maxWidth: "700px" }}>  
    <JobPreferences />
    <JobPicks />
    <Recommends />
    <JobList />
  </div>
</div>

      </div>  
    </>
  );
}

export default Home;
