import React from 'react';
import axios from 'axios';

import { Employee } from './';

function EmployeeList() {
    const [employees, setEmployees] = React.useState([]);
    const [recordForEdit, setRecordForEdit] = React.useState(null);

    React.useEffect(() => {
        refreshEmployees();
    }, []); // renders only once

    React.useEffect(() => {
        console.log("RENDER");
    }) // renders any time if the state was changed or browser was refreshed

    const API = (url = "https://localhost:5001/api/employees/") => {
        return {
            fetchEmployees: () => axios.get(url),
            create: data => axios.post(url, data),
            update: (Id, data) => axios.put(url + Id, data),
            delete: Id => axios.delete(url + Id)
        }
    }

    const addOrEdit = (formData, onSuccessMethod) =>  {
        if(formData.get("Id") == "0") {
            API().create(formData)
                .then(_ => {
                    onSuccessMethod();
                    refreshEmployees();
                })
                .catch(error => console.error(error));
        }
        else {
            API().update(formData.get("Id"), formData)
            .then(_ => {
                onSuccessMethod();
                refreshEmployees();
            })
            .catch(error => console.error(error));
        }
    }

    const refreshEmployees = () => {
        API().fetchEmployees()
            .then(res => {
                console.log(res);
                setEmployees(res.data);
            })
            .catch(error => console.error(error));
    }

    const showRecordDetailsHandler = data => {
        setRecordForEdit(data);
        console.log(recordForEdit);
    }

    const onDeleteHandler = (event, Id) => {
        event.stopPropagation(); // To stop the execution of others events (onClicks) in the same place.
        if(window.confirm("Are you sure to delete this record?")) {
            API().delete(Id)
                .then(_ => refreshEmployees())
                .catch(error => console.error(error));
        }
    }

    const imageCard = data => {
        return (
        <div className="card" onClick={() => showRecordDetailsHandler(data)}>
            <img src={data.imageSrc} className="card-img-top rounded-circle"/>
            <div className="card-body">
                <h5>{data.fullname}</h5>
                <span>{data.occupation}</span> <br />
                <button className="btn btn-light delete-button" onClick={event => onDeleteHandler(event, data.id)}>
                    <i className="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
        )
    }

    return (
        <div className="row" >
            <div className="col-md-12">
                <div className="jumbotron jumbotron-fluid py-4">
                    <div className="container text-center">
                        <h1 className="display-4">Employee Register</h1>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <Employee 
                    addOrEdit={addOrEdit} 
                    recordForEdit={recordForEdit}
                />
            </div>
            <div className="col-md-8">
                <table>
                    <tbody>
                        {
                            // For the max row of table (3)
                            // tr > 3 td
                            [...Array(Math.ceil(employees.length/3))].map((_, index) => 
                                <tr key={index + Math.random(100)}>
                                    <td>{imageCard(employees[3*index])}</td>
                                    <td>{employees[3*index + 1] ? imageCard(employees[3*index + 1]) : null}</td>
                                    <td>{employees[3*index + 2] ? imageCard(employees[3*index + 2]) : null}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EmployeeList
