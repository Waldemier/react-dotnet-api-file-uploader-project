import React from 'react'

const defaultImageSrc = '/img/default.png';

const initial = {
    id: 0,
    fullname: "",
    occupation: "",
    imageName: "",
    imageSrc: defaultImageSrc,
    imageFile: null
}

function Employee({ addOrEdit, recordForEdit }) {

    const [values, setValues] = React.useState(initial);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if(recordForEdit != null) {
            setValues(recordForEdit);
            console.log(values)
        }
    }, [recordForEdit]);

    const changeInputHandler = event => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const showPreview = event => {
        console.log(event.target.files)
        if(event.target.files && event.target.files[0]) {
            var imageFile = event.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                console.log("Src", x.target.result)
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile); // shows an image
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            })
        }
    }

    const validationFields = () => {
        let temp = {}
        temp.fullname = values.fullname == "" ? false : true;
        temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
        setErrors(temp)
        return Object.values(temp).every(x => x === true);
    }
    
    const resetForm = () => {
        setValues(initial);
        document.getElementById("image-uploader").value = null;
        setErrors({});
    }

    const formSubmitHandler = e => {
        e.preventDefault();
        if(validationFields()) {
            const formData = new FormData();

            formData.append("Id", values.id);
            formData.append("FullName", values.fullname);
            formData.append("Occupation", values.occupation);
            formData.append("ImageName", values.imageName);
            formData.append("ImageFile", values.imageFile);

            console.log("CHECK")
            console.log(formData.get("ImageName"));
            console.log(formData.get("ImageFile"));

            addOrEdit(formData, resetForm);
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field] == false) ? ' invalid-field' : '')

    return (
        <>
            <div className="container text-center">
                <p className="lead">An Employee</p>
            </div>
            <form autoComplete="off" noValidate onSubmit={formSubmitHandler}>
                <div className="card">
                    <img src={values.imageSrc} className="class-img-top" />
                    <div className="card-body">
                        <div className="form-group">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className={"form-control-file" + applyErrorClass("imageSrc")} 
                                id="image-uploader"
                                onChange={showPreview}
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                className={"form-control" + applyErrorClass("fullname")} 
                                placeholder="Employee Name" 
                                name="fullname" 
                                value={values.fullname} 
                                onChange={changeInputHandler}
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                    className={"form-control" + applyErrorClass("occupation")} 
                                    placeholder="Occupation" 
                                    name="occupation" 
                                    value={values.occupation} 
                                    onChange={changeInputHandler}
                            />
                        </div>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-light">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Employee
