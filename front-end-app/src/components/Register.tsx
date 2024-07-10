import React from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/apiService";
import { useNotification } from "../contexts/NotificationContext";
import { MESSAGES } from "../constants/messages";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleRegister = async (values: typeof initialValues) => {
    try {
      await registerUser(values.username, values.email, values.password);
      notify(MESSAGES.REGISTER_SUCCESS, "success");
      navigate("/login");
    } catch (error) {
      notify(MESSAGES.REGISTER_ERROR, "error");
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          //alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
              />
              <ErrorMessage
                name="username"
                render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
              />
              <ErrorMessage
                name="email"
                render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
              />
              <ErrorMessage
                name="password"
                render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
              />
              <ErrorMessage
                name="confirmPassword"
                render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;
