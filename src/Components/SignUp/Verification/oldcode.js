 
          to
          <br />
          your
          {loginMethodUsedByUser === "email" ? "email address" : "phone number"}
        </p>
        {loginMethodUsedByUser === "email" && <h2>{email}</h2>}
        {loginMethodUsedByUser === "phone" && <h2> + 1(373) 383 9933</h2>}



//old code

  const tempLogIn = () => {
    Cookies.set(cookieAuth, "cookie");
    navigate("/signup/create-account");
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Signup",
        action: "User Verified",
        label: "Signup",
        value: "Signup",
      },
    });
  };