import React, { useState } from "react";
import { View, ToastAndroid } from "react-native";
import { Button, Text, TextInput, HelperText } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import fetchServices from "../services/fetchServices";
import axiosClient from "../services/fetchServices";

export default function LoginForm({ navigation }) {
  const [showPass, setShowPass] = useState(false);

  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleLogin = async (values) => {
    try {
      const response = await axiosClient.post("/login", values);

      // Assuming the response contains necessary data to determine login success
      if (response?.data?.success) {
        navigation.navigate("Home");
      } else {
        showToast("Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error.message);
      showToast("Login failed. Please try again.");
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email( "Invalid Email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        await handleLogin(values);
      }}
      validationSchema={validationSchema}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        errors,
        touched,
        setFieldTouched,
      }) => (
        <View style={{ flex: 1 }}>
          <Text>Login</Text>
          <TextInput
            mode="outlined"
            placeholder="Email"
            label="Email"
            left={<TextInput.Icon name="email" />}
            style={{ marginTop: 10 }}
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={() => setFieldTouched("email")}
            error={touched.email && errors.email}
          />
          {touched.email && errors.email && (
            <HelperText type="error" visible={errors.email}>
              {errors.email}
            </HelperText>
          )}
          <TextInput
            mode="outlined"
            placeholder="Password"
            label="Password"
            left={<TextInput.Icon name="lock" />}
            secureTextEntry={!showPass}
            right={
              <TextInput.Icon
                name={showPass ? "eye" : "eye-off"}
                onPress={() => setShowPass(!showPass)}
              />
            }
            style={{ marginTop: 10 }}
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={() => setFieldTouched("password")}
            error={touched.password && errors.password}
          />
          {touched.password && errors.password && (
            <HelperText type="error" visible={errors.password}>
              {errors.password}
            </HelperText>
          )}
          <Button
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit}
            icon="login"
            mode="contained"
            style={{ marginTop: 10 }}
          >
            Login
          </Button>
          <Button
            disabled={isSubmitting}
            onPress={() => navigation.navigate("Register")}
            icon="account-plus"
            mode="contained"
            style={{ marginTop: 10 }}
          >
            Register
          </Button>
        </View>
      )}
    </Formik>
  );
}