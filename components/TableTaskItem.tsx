import { useState } from "react";
import Link from "next/link";
import { Collapse } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";

export interface iTableTaskItem {
  Task_ID: number;
  Title: string;
  Description: string;
  Due_Date: string;
  Priority: string;
  Task_Category?: string;
  Assigned_To?: string;
  BatchID?: string;
  Culture_Plan_ID?: string;
}

const TableTaskItem = ({
  Task_ID,
  Title,
  Description,
  Due_Date,
  Priority,
}: iTableTaskItem): JSX.Element => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <>
      <div className="mb-3">
        <Link href={`/tasks/${Task_ID}`}>{Title}</Link>
        <br />
        <small className="d-flex align-items-center">
        </small>
        <Collapse in={showDetail}>
          <small id={`task-Title-${Task_ID}`}>{Description}</small>
        </Collapse>
      </div>
      <small className="text-muted">
        {`Due date: ${Due_Date}`}
        <br />
        {"Priority: "}
        <span className="text-uppercase">{Priority}</span>
      </small>
    </>
  );
};

export default TableTaskItem;
