import { useState } from "react";
import type { NextPage } from "next";
import { Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";

import ButtonIcon from "../components/ButtonIcon";
import ModalContainer from "../components/ModalContainer";
import Layout from "../components/Layout";
import { micropropagationData } from "../data";
import useModal from "../hooks/useModal";
import SearchInput from "../components/Search";

const Micropropagation: NextPage = () => {
  const { modalOpen, showModal, closeModal } = useModal();
  const [MicropropagationType, setMicropropagationType] = useState("");
  const [MicropropagationName, setMicropropagationName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [plantType, setPlantType] = useState("");
  const [producedBy, setProducedBy] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isError, setIsError] = useState(false);

  // Add a new state for the search query
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMicropropagationData = micropropagationData.filter(
    ({ category, name, price, producedBy, qty, additionalNotes }) => {
      const query = searchQuery.toLowerCase();
      return (
        category.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        price.toString().toLowerCase().includes(query) ||
        producedBy.toLowerCase().includes(query) ||
        qty.toString().toLowerCase().includes(query) ||
        additionalNotes.toLowerCase().includes(query)
      );
    }
  );

  const addMicropropagation = () => {
    if (!MicropropagationName) {
      setIsError(true);
    } else {
      setIsError(false);
      closeModal();
    }
  };

  return (
    <Layout>
      <Row>
        <Col>
          <h3 className="pb-3">Micropropagations</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Replace the input element with the new SearchInput component */}
          <SearchInput
            className="my-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col>
          <ButtonIcon
            label="Add Micropropagation"
            icon={<FaPlus className="me-2" />}
            onClick={showModal}
            variant="primary"
          />
        </Col>
      </Row>
      <Table responsive className="my-4">
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Price</th>
            <th>Produced By</th>
            <th>Quantity</th>
            <th>Additional Notes</th>
            <th />
          </tr>
        </thead>
        <tbody>
  {filteredMicropropagationData &&
    filteredMicropropagationData.map(
      ({
        id,
        category,
        name,
        price,
        producedBy,
        qty,
        additionalNotes,
      }) => (
        <tr key={id}>
          <td>{category}</td>
          <td>{name}</td>
          <td>{price}</td>
          <td>{producedBy}</td>
          <td>{qty}</td>
          <td>{additionalNotes}</td>
          <td>
            <FaEdit onClick={showModal} className="show-pointer" />
          </td>
        </tr>
      )
    )}
</tbody>

      </Table>
      <ModalContainer
        title="Add Micropropagation to Inventory"
        isShow={modalOpen}
        handleCloseModal={closeModal}
        handleSubmitModal={addMicropropagation}
      >
        <>
          <small className="text-muted">
            Micropropagation is a consumable product using in your farm such as
            seeds, growing medium, fertilizer, pesticide, and so on.
          </small>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Choose type of Micropropagation</Form.Label>
              <Form.Select
                onChange={(e) => setMicropropagationType(e.target.value)}
              >
                <option value="1">Seed</option>
                <option value="2">Growing Medium</option>
                <option value="3">Agrochemical</option>
                <option value="4">Label and Crops Support</option>
                <option value="5">Seeding Container</option>
                <option value="6">Post Harvest Supply</option>
                <option value="7">Plant</option>
                <option value="8">Other Micropropagation</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Variety Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMicropropagationName(e.target.value)}
              />
              {isError && (
                <Form.Text className="text-danger">
                  The name field is required
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Plant Type</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setPlantType(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Label>Produced by</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setProducedBy(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The produced by field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Variety Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMicropropagationName(e.target.value)}
              />
              {isError && (
                <Form.Text className="text-danger">
                  The name field is required
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The quantity field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    onChange={(e) => setMicropropagationType(e.target.value)}
                  >
                    <option value="1">Seeds</option>
                    <option value="2">Packets</option>
                    <option value="3">Gram</option>
                    <option value="4">Kilogram</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Price per Unit</Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>€</InputGroup.Text>
                    <Form.Control
                      type="text"
                      onChange={(e) => setPriceUnit(e.target.value)}
                    />
                  </InputGroup>

                  {isError && (
                    <Form.Text className="text-danger">
                      The price field is required
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Expiration date</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={(e) => setExpirationDate(e.target.value)}
                    value={expirationDate}
                  />
                  {isError && (
                    <Form.Text className="text-danger">
                      The expiration date field is required
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                style={{ height: "120px" }}
              />
            </Form.Group>
          </Form>
        </>
      </ModalContainer>
    </Layout>
  );
};

export default Micropropagation;
