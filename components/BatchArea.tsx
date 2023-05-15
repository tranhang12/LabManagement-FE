import Link from "next/link";
import { Card, Col, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

export interface IBatchArea {
  Culture_Plan_ID: number;
  Area_Name: string;
  Initial_Quantity: number;
  Current_Quantity: number;
  Created_Date: string;
  Transition_Time: string;
  Remaining_Days: number;
}

const BatchArea = ({
  Culture_Plan_ID,
  Area_Name,
  Current_Quantity,
  Created_Date,
  Transition_Time,
  Remaining_Days,
}: IBatchArea): JSX.Element => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Row>
            <Col xs={12}>
              <h5>{Area_Name}</h5>
            </Col>
          </Row>
        </Card.Title>

        <Row className="mt-3">
          <Col xs={6} className="d-flex align-items-center flex-column">
            <small className="text-muted">Current Quantity</small>
            <div className="text-center">{Current_Quantity}</div>
          </Col>
          <Col xs={6} className="d-flex align-items-center flex-column">
            <small className="text-muted">Remaining Days</small>
            <div className="text-center">{Remaining_Days}</div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BatchArea;
