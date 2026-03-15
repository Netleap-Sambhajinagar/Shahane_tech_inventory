// Order tracking utility functions

export const getOrderStatusFromDB = (status) => {
  switch (status) {
    case 'Pending':
      return 'ordered';
    case 'In transmit':
      return 'dispatch';
    case 'Delivered':
      return 'delivered';
    case 'Cancelled':
      return 'cancelled';
    default:
      return 'ordered';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'ordered':
      return 'text-blue-600';
    case 'dispatch':
      return 'text-orange-600';
    case 'delivered':
      return 'text-green-600';
    case 'cancelled':
      return 'text-red-600';
    default:
      return 'text-slate-600';
  }
};

export const getStatusBgColor = (status) => {
  switch (status) {
    case 'ordered':
      return 'bg-blue-50';
    case 'dispatch':
      return 'bg-orange-50';
    case 'delivered':
      return 'bg-green-50';
    case 'cancelled':
      return 'bg-red-50';
    default:
      return 'bg-slate-50';
  }
};

export const formatOrderDate = (dateString) => {
  if (!dateString) return new Date();
  return new Date(dateString);
};

export const generateTrackingNumber = (orderId, orderDate) => {
  const timestamp = formatOrderDate(orderDate).getTime().toString().slice(-6);
  return `00${timestamp}NB21`;
};
