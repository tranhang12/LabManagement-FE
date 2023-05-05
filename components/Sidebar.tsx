import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Col, Nav } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/store/auth';
import iNavData from "@/types/iNavData";
import { adminNavData, userNavData } from "@/data/index";

const Sidebar = (): JSX.Element => {
  const router = useRouter();
  const authState = useSelector(selectAuthState);

  const userRole = authState.user?.Is_Admin;
  const displayNavData = userRole === 1 ? adminNavData : userNavData;

  return (
    <Col md={3} lg={2} className="bg-sidebar d-none d-md-block px-0 min-vh-100">
      <aside>
        <Nav defaultActiveKey={router.pathname} className="flex-column">
          <Nav.Link href="/">
            <div className="d-flex justify-content-center">
              <Image alt="LabOne logo" src={"/img/LabOne_logo.png"} width={110} height={110} />
            </div>
          </Nav.Link>
          {displayNavData  &&
            displayNavData.map(({ name, route, icon }: iNavData) => (
              <Nav.Item key={name}>
                <Link href={route} passHref legacyBehavior>
                <Nav.Link className="nav-link text-light">
                    <div className="d-flex align-items-center">
                      {icon}
                      <span>{name}</span>
                    </div>
                  </Nav.Link>
                </Link>
              </Nav.Item>
            ))}
        </Nav>
      </aside>
    </Col>
  );
};

export default Sidebar;
