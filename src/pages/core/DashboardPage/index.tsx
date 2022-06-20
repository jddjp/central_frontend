import { Heading } from "@chakra-ui/react";
import { DashboardSeller } from "pages/core/DashboardPage/DashboardSeller";

const DashboardCashier = () => {
  return <Heading>Dashboard cashier</Heading>;
}


const DashboardPage = () => {
  // TODO: Implement branch logic per each role
  const role = 'seller';

  switch(role) {
    case 'seller':
      return <DashboardSeller />
    break;
  }
}

export default DashboardPage;