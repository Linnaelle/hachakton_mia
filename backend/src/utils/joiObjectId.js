/**
 * Extension Joi pour la validation des ObjectId MongoDB
 * Permet de valider que les chaînes de caractères correspondent à des ObjectId valides
 */
const Joi = require('joi');  // Bibliothèque de validation
const mongoose = require('mongoose');  // ODM pour MongoDB

/**
 * Extension personnalisée de Joi pour valider les ObjectId MongoDB
 * @type {Joi.ExtensionFactory}
 * 
 * Utilisation: 
 *   const schema = Joi.object({
 *     userId: objectId.required()
 *   });
 */
const objectId = Joi.string().custom((value, helpers) => {
  // Vérification que la valeur est un ObjectId MongoDB valide
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { message: 'Invalid ObjectId' });
  }
  return value;  // Retourne la valeur si elle est valide
}, 'ObjectId validation');

// Export de l'extension pour utilisation dans d'autres modules
module.exports = objectId;