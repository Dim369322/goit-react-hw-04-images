import { toast } from 'react-toastify';

const options = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notifyInfo = message => toast.info(message, options);

export const notifyWarning = message => toast.warning(message, options);

export const notifyError = message => toast.error(message, options);
