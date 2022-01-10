{
  /* AVATAR */
}
{
  /* <div className={styles.avatar}>
                    <img
                      src={value.photos[0].url}
                      alt={value.names[0].displayName}
                    />
                  </div> */
}

const HandleClick = (email) => {
  const updatedCheckedState = checkedState.map((item) =>
    item.email === email
      ? { ...item, checked: !item.checked }
      : { ...item, checked: item.checked }
  );
  setCheckedState(updatedCheckedState);

  const contacts = updatedCheckedState.filter((item) => item.checked === true);

  console.log("the contacts length", contacts);

  setSelectedContacts(contacts);
};

const [filteredData, setFilteredData] = useState(
  data ? data : giftNFT__contactData ? giftNFT__contactData : []
);

const [checkedState, setCheckedState] = useState(
  checkAllContacts(data ? data : giftNFT__contactData || [])
);

setSendGiftEmail(event.target.value.toLowerCase());

const [sendGiftEmail, setSendGiftEmail] = useState("");

const giftNFT__contactData = useSelector((state) => state.giftNFT__contactData);
