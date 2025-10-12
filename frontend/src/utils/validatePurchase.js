import JustValidate from 'just-validate';
import { getCurrentPageId } from './urls';
import api from './api';
import { showToast } from './toast';

const validatePurchase = () => {
  const form = document.querySelector('#purchase_form');

  if (!form) return;

  const validator = new JustValidate(form);

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
    .addField('#user_quantity', [
      {
        rule: 'required',
        errorMessage: 'Quntity is required',
      },
      {
        rule: 'minNumber',
        value: 1,
        errorMessage: 'At least 1 ticket',
      },
      {
        rule: 'maxNumber',
        value: 10,
        errorMessage: 'You can buy up to 10 tickets only',
      },
    ])
    .onSuccess(async (event) => {
      console.log('✅ Validation passed');
      event.preventDefault();

      const name = document.getElementById('user_name').value;
      const surname = document.getElementById('user_surname').value;
      const email = document.getElementById('user_email').value;
      const quantity = document.getElementById('user_quantity').value;
      const id = getCurrentPageId();

      try {
        const response = await api.post(`spectacles/${id}/buy_ticket`, {
          name,
          surname,
          email,
          quantity,
          id: id,
        });

        showToast('Ticket purchased successfully!', 'success');
        console.log(response.data);
      } catch (error) {
        showToast('Error processing purchase', 'error');
        console.error(error);
      }
    });
};

export default validatePurchase;
