import React from 'react';
import {Formik} from 'formik';
import gql from "graphql-tag";
import Mutation from "react-apollo/Mutation";

const MutationToRun = gql`
mutation(
    $name: String!
    $email: String!
    $phone: String!
    $address: String!
    $zipcode: Int!
    $Links: [LinkCreateInput!]!
){
  createAgent(data:{
    name: $name
    email: $email
    phone: $phone
    address: $address
    zipcode: $zipcode
    imageLinks:{
      create: $Links
    }
  }){
    id
  }
}
`;


const uploadFilesAndGetLinks = (images) => {

    // Use this function to upload images to AWS S3 or any other cloud storage
    // return array of objects with each object containing url key of image link


let sampleLinks = [];

    for (let i = 0; i<images.length; i++) {
              //returning sample link for individual image
        sampleLinks.push({url: "sample-link-"+i})
    }

    return sampleLinks;
};

const FormToShow = () => {
    return (
        <>

            <Mutation mutation={MutationToRun} onCompleted={()=>{
                alert("Your data has been saved.");
                window.location.reload();
            }}

                      onError={()=>{
                          alert("An error occurred.");
                      }}

            >
                {

                    (startMutation, {loading, error, called}) =>

                        <Formik
                            validate={values => {
                                let errors = {};

                                //email validation
                                if (!values.email) {
                                    errors.email = 'Required';
                                } else if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                ) {
                                    errors.email = 'Invalid email address';
                                }

                                //name validation
                                if (!values.name) {
                                    errors.name = 'Required';
                                } else if (
                                    !/^[a-zA-Z ]+$/.test(values.name)
                                ) {
                                    errors.name = 'Invalid name';
                                }

                                //phone validation
                                if (!values.phone) {
                                    errors.phone = 'Required';
                                } else if (
                                    !/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/.test(values.phone)
                                ) {
                                    errors.phone = 'Invalid Phone Number';
                                }

                                //address validation
                                if (!values.address) {
                                    errors.address = 'Required';
                                } else if (
                                    !/^[a-zA-Z0-9\s,'-]*$/.test(values.address)
                                ) {
                                    errors.address = 'Invalid Address';
                                }

                                //zipcode validation
                                if (!values.zipcode) {
                                    errors.zipcode = 'Required';
                                } else if (
                                    !/^[0-9]{6,6}$/.test(values.zipcode)
                                ) {
                                    errors.zipcode = 'Invalid Zipcode';
                                }


                                //images validation
                                if (!values.images) {
                                    errors.images = 'Required';
                                } else if (
                                    !values.images.length > 0
                                ) {
                                    errors.images = 'Add atleast one image';
                                }

                                return errors;
                            }}

                            onSubmit={(values, actions) => {

                                console.log("values are ", values);

                                startMutation({
                                    variables: {
                                        name: values.name,
                                        email: values.email,
                                        phone: values.phone,
                                        address: values.address,
                                        zipcode: parseInt(values.zipcode),
                                        Links: uploadFilesAndGetLinks(values.images)
                                    }
                                });

                                return false;

                            }}

                            render={({
                                         values,
                                         errors,
                                         status,
                                         touched,
                                         handleBlur,
                                         handleChange,
                                         handleSubmit,
                                         isSubmitting,
                                         setFieldValue
                                     }) => (


                                <div className="container-fluid">
                                    <div className="col-md-8 m-4">
                                        <form autoComplete="off" method="post">
                                            { //name element
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Name</label>
                                                    <div className="col-sm-7">

                                                        <input autoComplete="off"
                                                               type="text"
                                                               name="name"
                                                               onBlur={handleBlur}
                                                               onChange={handleChange}
                                                               value={values.name}
                                                               className={
                                                                   touched.name && values.name && !errors.name ? "form-control is-valid" : "form-control" &&
                                                                   touched.name && errors.name ? "form-control is-invalid" : "form-control"
                                                               }
                                                               placeholder="Name"/>
                                                    </div>
                                                    {
                                                        touched.name && errors.email &&
                                                        <div className="col-sm-3">
                                                            <small className="text-danger">
                                                                {errors.name}
                                                            </small>
                                                        </div>

                                                    }
                                                </div>
                                            }


                                            { //email element
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Email</label>
                                                    <div className="col-sm-7">

                                                        <input autoComplete="off"
                                                               type="email"
                                                               name="email"
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.email}
                                                               className={
                                                                   touched.email && values.email && !errors.email ? "form-control is-valid" : "form-control" &&
                                                                   touched.email && errors.email ? "form-control is-invalid" : "form-control"
                                                               }
                                                               placeholder="Email"/>
                                                    </div>
                                                    {
                                                        touched.email && errors.email &&
                                                        <div className="col-sm-3">
                                                            <small className="text-danger">
                                                                {errors.email}
                                                            </small>
                                                        </div>

                                                    }
                                                </div>
                                            }


                                            { //phone number element
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Phone</label>
                                                    <div className="col-sm-7">

                                                        <input autoComplete="off"
                                                               type="tel"
                                                               name="phone"
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.phone}
                                                               className={
                                                                   touched.phone && values.phone && !errors.phone ? "form-control is-valid" : "form-control" &&
                                                                   touched.phone && errors.phone ? "form-control is-invalid" : "form-control"
                                                               }
                                                               placeholder="Phone Number"/>
                                                    </div>
                                                    {
                                                        touched.phone && errors.phone &&
                                                        <div className="col-sm-3">
                                                            <small className="text-danger">
                                                                {errors.phone}
                                                            </small>
                                                        </div>

                                                    }
                                                </div>
                                            }


                                            { //address element
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Address</label>
                                                    <div className="col-sm-7">

                                                        <input autoComplete="off"
                                                               type="tel"
                                                               name="address"
                                                               onChange={handleChange}
                                                               value={values.address}
                                                               onBlur={handleBlur}
                                                               className={
                                                                   touched.address && values.address && !errors.address ? "form-control is-valid" : "form-control" &&
                                                                   touched.address && errors.address ? "form-control is-invalid" : "form-control"
                                                               }
                                                               placeholder="Address"/>
                                                    </div>
                                                    {
                                                        touched.address && errors.address &&
                                                        <div className="col-sm-3">
                                                            <small className="text-danger">
                                                                {errors.address}
                                                            </small>
                                                        </div>

                                                    }
                                                </div>
                                            }


                                            { //zipcode element
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Zipcode</label>
                                                    <div className="col-sm-7">

                                                        <input autoComplete="off"
                                                               type="tel"
                                                               name="zipcode"
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.zipcode}
                                                               className={
                                                                   touched.zipcode && values.zipcode && !errors.zipcode ? "form-control is-valid" : "form-control" &&
                                                                   touched.zipcode && errors.zipcode ? "form-control is-invalid" : "form-control"
                                                               }
                                                               placeholder="Zipcode"/>
                                                    </div>
                                                    {
                                                        errors.zipcode && touched.zipcode &&
                                                        <div className="col-sm-3">
                                                            <small className="text-danger">
                                                                {errors.zipcode}
                                                            </small>
                                                        </div>
                                                    }
                                                </div>
                                            }


                                            { //images element

                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Image & License</label>
                                                    <div className="col-sm-7">

                                                        <input autoComplete="off"
                                                               type="file"
                                                               name="images"
                                                               accept="image/*"
                                                               onChange={
                                                                   (e) => setFieldValue("images", e.currentTarget.files)
                                                               }
                                                               onBlur={handleBlur}
                                                               className={
                                                                   touched.images && values.images && !errors.images ? "form-control is-valid" : "form-control" &&
                                                                   touched.images && errors.images ? "form-control is-invalid" : "form-control"
                                                               }
                                                               placeholder="Add photos and license"/>
                                                    </div>
                                                    {
                                                        errors.images && touched.images &&
                                                        <div className="col-sm-3">
                                                            <small className="text-danger">
                                                                {errors.images}
                                                            </small>
                                                        </div>
                                                    }
                                                </div>

                                            }


                                            { //submit button element

                                                <div className="form-group row">

                                                    <button type="submit"

                                                            onClick={
                                                                (e)=> {
                                                                    e.preventDefault()
                                                                    handleSubmit();
                                                                }
                                                            }

                                                            disabled={
                                                        isSubmitting ||
                                                        Object.keys(errors).length !== 0 ||
                                                        Object.keys(touched).length !== 6
                                                    } className="btn btn-primary">

                                                        {isSubmitting ? "Submitting.." : "Submit"}

                                                    </button>

                                                </div>

                                            }


                                        </form>
                                    </div>
                                </div>
                            )}
                        />

                }

            </Mutation>


                    </>
    );
};

export default FormToShow;