module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "Accounts",
                "email",
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: false,
                },
                { transaction }
            );
            await queryInterface.addIndex("Accounts", {
                fields: ["email"],
                unique: true,
                transaction,
            });
            await queryInterface.addColumn(
                "Accounts",
                "formattedEmail",
                {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: false,
                },
                { transaction }
            );
            await queryInterface.addIndex("Accounts", {
                fields: ["formattedEmail"],
                unique: true,
                transaction,
            });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn("Accounts", "email", {
                transaction,
            });
            await queryInterface.removeColumn("Accounts", "formattedEmail", {
                transaction,
            });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
