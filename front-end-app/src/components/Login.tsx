import React from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../services/apiService";
import { useNotification } from "../contexts/NotificationContext";
import { MESSAGES } from "../constants/messages";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleLogin = async (values: typeof initialValues) => {
    try {
      await loginUser(values.email, values.password);
      notify(MESSAGES.LOGIN_SUCCESS, "success");
      navigate("/dashboard");
    } catch (error) {
      notify(MESSAGES.LOGIN_ERROR, "error");
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
          Login
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form>
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
                render={(msg) => <div className="error-message">{msg}</div>}
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
                render={(msg) => <div className="error-message">{msg}</div>}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
