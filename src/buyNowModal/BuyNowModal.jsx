import React, { useState } from "react";
import { Button, Dialog, DialogContent, TextField, Typography } from "@mui/material";

const BuyNowModal = ({ addressInfo, setAddressInfo, openPaymentModal }) => {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const handleOpen = () => {
        setOpen(!open);
        setErrors({}); // Reset errors when modal is opened
    };

    const validateForm = () => {
        const errors = {};
        // Validate pincode
        if (!/^\d{6}$/.test(addressInfo.pincode)) {
            errors.pincode = "Pincode must be 6 digits";
        }
        // Validate email
        if (!/\S+@\S+\.\S+/.test(addressInfo.email)) {
            errors.email = "Invalid email address";
        }
        // Validate phone number
        if (!/^\d{10}$/.test(addressInfo.mobileNumber)) {
            errors.mobileNumber = "Mobile number must be 10 digits";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            handleOpen();
            openPaymentModal();
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                style={{ width: "100%", padding: "12px" }}
            >
                Buy Now
            </Button>

            <Dialog open={open} onClose={handleOpen} fullWidth>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Enter Your Details
                    </Typography>

                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={addressInfo.name}
                        onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                    />

                    <TextField
                        label="Address"
                        fullWidth
                        margin="normal"
                        value={addressInfo.address}
                        onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                    />

                    <TextField
                        label="Pincode"
                        fullWidth
                        margin="normal"
                        error={!!errors.pincode}
                        helperText={errors.pincode}
                        value={addressInfo.pincode}
                        onChange={(e) => setAddressInfo({ ...addressInfo, pincode: e.target.value })}
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                        value={addressInfo.email}
                        onChange={(e) => setAddressInfo({ ...addressInfo, email: e.target.value })}
                    />

                    <TextField
                        label="Mobile Number"
                        fullWidth
                        margin="normal"
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber}
                        value={addressInfo.mobileNumber}
                        onChange={(e) =>
                            setAddressInfo({ ...addressInfo, mobileNumber: e.target.value })
                        }
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                        style={{ marginTop: "16px", width: "100%" }}
                    >
                        Proceed to Payment
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BuyNowModal;
