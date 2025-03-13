// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {

//     // Truncar as tabelas Orders e OrderProducts
//     await queryInterface.bulkDelete('OrderProducts', null, { cascade: true });
//     await queryInterface.bulkDelete('Orders', null, { cascade: true });

//     // Adicionar coluna userId de volta à tabela Orders
//     await queryInterface.addColumn('Orders', 'userId', {
//       type: Sequelize.UUID,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'userId',
//       },
//     });
//   },

//   down: (queryInterface, Sequelize) => {
//     /*
//       Add reverting commands here.
//       Return a promise to correctly handle asynchronicity.

//       Example:
//       return queryInterface.dropTable('users');
//     */
//   }
// };
