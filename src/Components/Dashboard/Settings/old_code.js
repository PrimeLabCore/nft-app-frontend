{
  /* Hidden until 2FA actually works
                                  <Col md={{ span: 8, offset: 2 }}>
                                    <div
                                      className={styles.settings__acc__inner}
                                      onClick={() => Authentication(true)}
                                    >
                                      <h5>Security</h5>
                                      <div className={styles.settings__acc}>
                                        <div className={styles.settings__name__info}>
                                          <h6>Add 2FA authentication</h6>
                                        </div>
                                        <button>
                                          <IoIosArrowForward />
                                        </button>
                                      </div>
                                    </div>
                                  </Col>
                                */
}

const Authentication = (isEnable) => {
  if (isEnable) {
    toast.success("2FA Enabled");
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Settings",
        action: "2FA Enabled",
        label: "Settings",
        value: "Settings",
      },
    });
  } else {
    toast.success("2FA Disabled");
  }
};
