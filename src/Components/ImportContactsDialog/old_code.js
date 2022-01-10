//normalize contacts
let contactsNormalized = contacts.map((contact) => {
  return {
    fullname: contact.fullName(),
    primary_phone: contact.primaryPhone(),
    primary_email: contact.primaryEmail(),
    first_name: contact.first_name,
    last_name: contact.last_name,
    phones: contact.phone,
    emails: contact.email,
  };
});
