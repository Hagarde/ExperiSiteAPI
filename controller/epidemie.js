import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import EpidemieModel from '../model/epidemie.js';
import ExperienceModel from '../model/experience.js';

const secret = 'test';

export const create = async (req, res) => {
    try {
      const {DD, R} = req.body; 
       const result = await EpidemieModel.create({
        DD : DD , 
        R : R, 
       })

       const token = jwt.sign({DD : result.DD, R : result.R}, secret, {expiresIn:'1h'});
       res.status(200).json({result, token})
    } catch(error) {
        res.status(500).json({message : " Pas marché "});
        console.log(error);
    }
}

export const getRandomEpidemie =  async (req,res) => {
    try {
        // Utiliser l'agrégation MongoDB pour obtenir un élément aléatoire
        const randomElement = await EpidemieModel.aggregate([{ $sample: { size: 1 } }]);
    
        // Vérifier si un élément a été trouvé
        if (!randomElement || randomElement.length === 0) {
          return res.status(404).json({ message: 'Aucun élément trouvé.' });
        }
    
        // Répondre avec l'élément aléatoire
        res.status(200).json(randomElement[0]);
      } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'élément aléatoire.' });
      }
}

export const deleteEpidemieById = async (req, res) => {
    try {
      const id = req.params.id; // Récupérer l'ID depuis les paramètres de l'URL
      // Vérifier si l'ID est valide (utilisez l'ID comme format approprié pour MongoDB)
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'ID invalide.' });
      }
  
      // Supprimer la donnée par ID
      const deletedData = await EpidemieModel.findByIdAndDelete(id);
  
      // Vérifier si la donnée a été trouvée et supprimée
      if (!deletedData) {
        return res.status(404).json({ message: 'Donnée non trouvée.' });
      }
  
      // Répondre avec la donnée supprimée
      res.status(200).json(deletedData);
    } catch (error) {
      // En cas d'erreur, renvoyer une réponse d'erreur
      console.log(error)
      res.status(500).json({ error: 'Erreur lors de la suppression de la donnée.' });
    }
  };

export const get10Epidemie = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Récupérer le numéro de page à partir des paramètres de requête (par défaut : page 1)
      const limit = 10; // Définir le nombre maximum d'éléments à renvoyer par page
  
      // Calculer l'index de départ et de fin pour la pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      // Récupérer les éléments avec la pagination
      const data = await EpidemieModel.find().skip(startIndex).limit(limit);
  
      // Compter le nombre total d'éléments dans la base de données
      const totalData = await EpidemieModel.countDocuments();
  
      // Préparer les informations de pagination pour la réponse
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalData / limit),
      };
  
      // Répondre avec les éléments et les informations de pagination
      res.status(200).json({ data, pagination });
    } catch (error) {
      // En cas d'erreur, renvoyer une réponse d'erreur
      res.status(500).json({ error: 'Erreur lors de la récupération des éléments.' });
    }
  };

export const getEpidemie = async (req,res) => {  
  try {
    const experienceId = req.params.experienceId;

    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({ message: 'ID d\'expérience non valide' });
    }

    // Remplacez le champ `fieldToPopulate` par le nom du champ qui pointe vers l'épidémie dans votre modèle d'expérience
    const epidemie = (await ExperienceModel.findById(experienceId).populate('epidemie')).epidemie;


    if (!epidemie) {
      return res.status(404).json({ message: 'Épidémie non trouvée' });
    }

    res.json(epidemie);
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
}
};


