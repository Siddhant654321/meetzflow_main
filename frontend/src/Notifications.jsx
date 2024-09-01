import { useState } from "react";
import MySpinner from "./Components/MySpinner";
import Item from "./Components/Item";
import useFetchData from "./CustomHooks/useFetchData";
import TimeAlert from "./Components/TimeAlert";

const Notifications = () => {
  const [isFetchingData, setIsFetchingData] = useState(() => true);
  const [notificationData, setNotificationData] = useState(() => "");
  const data = useFetchData({ setIsFetchingData, setNotificationData });

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
            name="Notifications"
            pagination={true}
            noNewBtn={true}
            className="minimum-heighted-div col-sm-10 col-12"
            limit={12}
            content={notificationData}
          />
        </div>
      </div>
    </>
  );
};

export default Notifications;
