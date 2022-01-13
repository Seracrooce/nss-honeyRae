import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getAllEmployees } from "../ApiManager";

export const Ticket = () => {
    const [ticket, setTicket] = useState({});
    const [employees, syncEmployees] = useState([]);
    const { ticketId } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch(`http://localhost:8088/tickets/${ticketId}?_expand=customer&_expand=employee`)
            .then(res => res.json())
            .then(data => setTicket(data))
    },[ ticketId ]);

    //fetch employees
    useEffect(() => {
        getAllEmployees()
            .then(employees => syncEmployees(employees))
    }, []);

    //function to update the database
    const assignEmployee = (evt) => {

        const updatedTicket = {
            customerId: ticket.customerId,
            employeeId: parseInt(evt.target.value),
            description: ticket.description,
            emergency: ticket.emergency,
            dateCompleted: ticket.dateCompleted
        }

        fetch(`http://localhost:8088/tickets/${ticket.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTicket)
        }).then(() => {history.push("/tickets")})
    }

    return (
        <>
            <h2>Ticket Number {ticket.id}</h2>
            <div>
                <h3 className="ticket__description">{ticket.description}</h3>
                <div className="ticket__customer">Submitted by {ticket.customer?.name}</div>
                <div className="ticket__employee">Assigned to 
                    <select value={ ticket.employeeId } onChange={ assignEmployee }>
                        {
                            employees.map(e => <option key={`employee--${e.id}`} value={e.id}>{e.name}</option>)
                        }
                    </select>
                </div>
            </div>
        </>
    )
}