import { useState, useEffect } from "react";
import MySpinner from "./Components/MySpinner";
import Item from "./Components/Item";
import useFetchData from "./CustomHooks/useFetchData";
import { useSelector } from "react-redux";
import TimeAlert from "./Components/TimeAlert";

const Teams = () => {
  const [isFetchingData, setIsFetchingData] = useState(() => true);
  const [teamData, setTeamData] = useState(() => "");
  const [teamDataChanged, setTeamDataChanged] = useState(0);
  const newTeam = useSelector((store) => store.teamData);
  const data = useFetchData({ setIsFetchingData, setTeamData });

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
      <div className="fluid-container dashboard">
        <div
          className="row justify-content-center gx-3"
          style={{ flex: "1", margin: "0px 25px" }}
        >
          <Item
            name="Teams"
            dataChanged={teamDataChanged}
            pagination={true}
            className="minimum-heighted-div col-sm-10 col-12"
            limit={12}
            content={teamData}
            changeData={setTeamData}
            setDataChanged={setTeamDataChanged}
          />
        </div>
      </div>
    </>
  );
};

export default Teams;
