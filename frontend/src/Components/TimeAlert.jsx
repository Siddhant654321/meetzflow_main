import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import '../styles/timeAlert.css'

const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Time Zone</Popover.Header>
    <Popover.Body>
      All dates and times are in <strong>Pacific Time</strong>
    </Popover.Body>
  </Popover>
);

const TimeAlert = () => (
  <div className='time-alert-div'>
    <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
        <Button className='time-alert-button'><i className="bi bi-info-circle"></i></Button>
    </OverlayTrigger>
  </div>
);

export default TimeAlert;