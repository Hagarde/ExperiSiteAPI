import mongoose from 'mongoose';
import experienceModel from '../model/experience.js';
import epidemieModel from '../model/epidemie.js';
import frameModel from '../model/frame.js';


export const create = async ( req, res) => {
    try {
      const epidemieId = req.body.epidemie;
      const migration_ = req.body.migration;
      const t_ = req.body.t;
      const initialisation_  = req.body.initialisation;
      const acceleration_ = Math.random() < 0.5 ? true : false;

      const epidemie_ = await epidemieModel.findById(epidemieId).catch((error)=>{res.status(500).json({message: "Experience n'existant pas"})});
      const result = await experienceModel.create({
        epidemie : epidemie_ , 
        migration : migration_, 
        t : t_, 
        initialisation : initialisation_, 
        acceleration: acceleration_
       })

       res.status(200).json(result)
       
    } catch(error) {
        res.status(500).json({message : " Pas marché "});
        console.log(error);
    }
};

export const get10Experience = async (req, res) => {
    try {
        // Récupérer les 10 derniers éléments en les triant par ordre décroissant d'ID (ou de date de création)
        const data = await experienceModel.find().sort({ _id: -1 }).limit(10);
    
        // Répondre avec les 10 derniers éléments
        res.status(200).json(data);
      } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur
        res.status(500).json({ error: 'Erreur lors de la récupération des 10 derniers éléments.' });
      }
};

export const deleteExperienceById = async (req, res) => {
  try {
    const id = req.params.id; // Récupérer l'ID depuis les paramètres de l'URL
    // Vérifier si l'ID est valide (utilisez l'ID comme format approprié pour MongoDB)
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID invalide.' });
    }

    // Supprimer la donnée par ID
    const deletedData = await experienceModel.findByIdAndDelete(id);

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

export const incrementTOfEpidemie = async (req, res) => {
  const itemId = req.params.id;
  try {
    // Recherchez l'élément par son ID dans la base de données
    const itemToUpdate = await experienceModel.findById(itemId);

    if (!itemToUpdate) {
      return res.status(404).json({ message: 'Élément non trouvé.' });
    }

    // Mettez à jour les propriétés de l'élément avec les nouvelles données
    itemToUpdate.t += 1 

    // Sauvegardez les modifications dans la base de données
    await itemToUpdate.save();

    return res.json({ message: 'Élément mis à jour avec succès.', updatedItem: itemToUpdate });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élément :', error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour de l\'élément.' });
  }
};

export const getFramesFromExperience = async (req,res) => {
  try {
    const experienceId = req.params.experienceId;
    // Recherchez toutes les frames associées à l'expérience donnée
    const frames = await frameModel.find({ experience: experienceId });
    res.json(frames);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des éléments.' });
  }
}