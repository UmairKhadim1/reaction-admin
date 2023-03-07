import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { registerOperatorRoute } from "/imports/client/ui";
import DiscountsPage from "./DiscountsPage.js";
import PaymentDashboardPage from "./PaymentDashboardPage";
registerOperatorRoute({
  group: "navigation",
  priority: 60,
  path: "/discounts",
  MainComponent: DiscountsPage,
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faPercent} {...props} />,
  sidebarI18nLabel: "admin.shortcut.discountsLabel"
});
registerOperatorRoute({
  group: "navigation",
  priority: 60,
  path: "/paymentDashboard",
  MainComponent: PaymentDashboardPage,
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faDollarSign} {...props} />,
  sidebarI18nLabel: "admin.shortcut.discountsLabel"
});

