export const columns = [
  {
    Header: "Hora",
    accessor: "hour",
  },
  {
    Header: "Cliente",
    accessor: "client",
    Cell: function MemberCell(data: any) {
      return data;
    },
  },
];
