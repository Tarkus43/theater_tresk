import JustValidate from "just-validate";
import axios from "axios";
import { getCurrentPageId } from "./urls";

const validatePurchase = () => {
    const validator = new JustValidate('#purchase_form')

    validator
        .addField('#user_name', [
            {
            rule: 'required',
            errorMessage: 'Name is required',
            },
            {
            rule: 'minLength',
            value: 2,
            errorMessage: 'Name must be at least 2 characters',
            },
            {
            rule: 'maxLength',
            value: 50,
            errorMessage: 'Name must be less than 50 characters',
            },
        ])
        .addField('#user_surname', [
            {
            rule: 'required',
            errorMessage: 'Surname is required',
            },
            {
            rule: 'minLength',
            value: 2,
            errorMessage: 'Surname must be at least 2 characters',
            },
            {
            rule: 'maxLength',
            value: 50,
            errorMessage: 'Surname must be less than 50 characters',
            },
        ])
        .addField('#user_email', [
            {
            rule: 'required',
            errorMessage: 'Email is required',
            },
            {
            rule: 'email',
            errorMessage: 'Email is not valid',
            },
        ])
        .onSuccess( async (event) => {
            event.preventDefault();

        const name = document.getElementById('user_name').value;
        const email = document.getElementById('user_email').value;

        try {
            const response = await axios.post('http://localhost:8000/api/tickets/', {
            name,
            email,
            spectacle_id: getCurrentPageId(),
            });

            alert('Purchase successful!');
            console.log(response.data);
        } catch (error) {
            alert('Error processing your purchase.');
            console.error(error);
        }
        });


};

export default validatePurchase;