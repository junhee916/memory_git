'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Boards.init({
    writeId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId:DataTypes.INTEGER,
    writes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Boards',
  });
  return Boards;
};