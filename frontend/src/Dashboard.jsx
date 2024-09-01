import React, { useState, useEffect } from "react";
import MySpinner from "./Components/MySpinner";
import Item from "./Components/Item";
import useFetchData from "./CustomHooks/useFetchData";
import "./styles/dashboard.css";
import { useSelector } from "react-redux";
import TimeAlert from "./Components/TimeAlert";

const Dashboard = () => {
  const [isFetchingData, setIsFetchingData] = useState(() => true);
  const [meetingData, setMeetingData] = useState(() => "");
  const [teamData, setTeamData] = useState(() => "");
  const [notificationData, setNotificationData] = useState(() => "");
  const [schedulerData, setSchedulerData] = useState(() => "");
  const [teamDataChanged, setTeamDataChanged] = useState(0);
  const data = useFetchData({
    setMeetingData,
    setTeamData,
    setSchedulerData,
    setNotificationData,
    setIsFetchingData,
  });
  const newTeam = useSelector((store) => store.teamData);

  useEffect(() => {
    setTeamData((prevTeamData) => {
      if (Array.isArray(prevTeamData)) {
        return [...prevTeamData, newTeam];
      }
      return [newTeam];
    });
    setTeamDataChanged((prev) => prev + 1);
  }, [newTeam]);

  if (isFetchingData) {
    return <MySpinner className="not-full-width" />;
  }

  return (
    <>
      <TimeAlert />
      <div
        className="fluid-container dashboard p-6"
        style={{ padding: "0px 25px" }}
      >
        <div
          className="row justify-content-center"
          style={{ flex: "1", gap: "20px" }}
        >
          <Item
            name="Notifications"
            noNewBtn={true}
            className="col-sm-10 col-12"
            limit={3}
            content={notificationData}
          />
          <Item
            name="Meetings"
            noNewBtn={true}
            className="col-sm-10 col-12"
            limit={3}
            content={meetingData}
          />
          <div
            className="row col-12 justify-content-center p-lg-2 p-0"
            style={{ gap: "20px" }}
          >
            <Item
              name="Schedulers"
              className="col-lg-5 col-sm-10 col-12"
              limit={3}
              content={schedulerData}
            />
            <Item
              name="Teams"
              dataChanged={teamDataChanged}
              className="col-lg-5 col-sm-10 col-12"
              limit={3}
              content={teamData}
              changeData={setTeamData}
              setDataChanged={setTeamDataChanged}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
