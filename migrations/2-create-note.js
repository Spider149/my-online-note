"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Notes", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            accountId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Accounts",
                    key: "id",
                },
                allowNull: false,
                onDelete: "cascade",
                onUpdate: "cascade",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Notes");
    },
};
