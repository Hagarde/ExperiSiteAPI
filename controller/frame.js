import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import frameModel from '../model/frame.js';
import epidemieModel from '../model/epidemie.js';

const secret = 'test';

export const create = async (req, res) => {
    try {
      const experience_ = await epidemieModel.findById(req.body.epidemie).catch((error)=>{res.status(500).json({message: "Experience n'existant pas"})});
      const t_ = req.body.t;
      const population_ = req.body.population;
       const result = await frameModel.create({
        experience : experience_,
        t : t_,
        population : population_,
       });
       res.status(200).json({result})
       
    } catch(error) {
        res.status(500).json({message : " Pas marché "});
        console.log(error);
    }
};

export const get10Frame = async (req,res) => {
    try {
        // Récupérer les 10 derniers éléments en les triant par ordre décroissant d'ID (ou de date de création)
        const data = await frameModel.find().sort({ _id: -1 }).limit(10);
    
        // Répondre avec les 10 derniers éléments
        res.status(200).json(data);
      } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur
        res.status(500).json({ error: 'Erreur lors de la récupération des 10 derniers éléments.' });
      }
};

export const getDataByIdOrTime = async (req, res) => {
    try {
      const { identifier } = req.params; // Récupérer l'ID ou le temps depuis les paramètres de l'URL
  
      // Vérifier si l'identifiant est un nombre (dans le cas où il représente le temps)
      const isTimeIdentifier = !isNaN(identifier);
  
      // Récupérer l'élément spécifique en fonction de l'ID ou du temps
      let data;
      if (isTimeIdentifier) {
        data = await frameModel.findOne({ temps: parseInt(identifier) });
      } else {
        data = await frameModel.findById(identifier);
      }
  
      // Vérifier si l'élément a été trouvé
      if (!data) {
        return res.status(404).json({ message: 'Élément non trouvé.' });
      }
  
      // Répondre avec l'élément spécifique
      res.status(200).json(data);
    } catch (error) {
      // En cas d'erreur, renvoyer une réponse d'erreur
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'élément spécifique.' });
    }
};

export const deleteFrame = async (req, res) => {
  try {
    const id = req.params.id; // Récupérer l'ID depuis les paramètres de l'URL
    // Vérifier si l'ID est valide (utilisez l'ID comme format approprié pour MongoDB)
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID invalide.' });
    }

    // Supprimer la donnée par ID
    const deletedData = await frameModel.findByIdAndDelete(id);

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