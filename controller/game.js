import frameModel from '../model/frame.js';
import epidemieModel from '../model/epidemie.js';
import experienceModel from '../model/experience.js';
import {population, I0} from '../parameter.js';
import nextDay from '../calcul.js/calcul.js';

export const initialisationJeu = async (req, res) => {
    try {
        const epidemie_ = (await epidemieModel.aggregate([{ $sample: { size: 1 } }]))[0] || null;
        const lieuInitialisation = ['XA','YB', 'XAXB', 'XAYB'][Math.floor(Math.random() * 4)];
        const experience = await experienceModel.create({
            epidemie : epidemie_._id, 
            migration : ['libre', 'ferme','XY', 'AB'][Math.floor(Math.random() * 4)],
            initialisation : lieuInitialisation,
            acceleration: Math.random() < 0.5 ? true : false,
            t : 0
        });


        const frame = {
            experience: experience._id,
            t:0,
            population : population, 
            S1: lieuInitialisation.indexOf('XA') !== -1 ? population - I0 : population, 
            U1: lieuInitialisation.indexOf('XA') !== -1 ? I0 : 0, 
            P1: 0, RU1 :0, RP1 : 0, 
            S2: lieuInitialisation.indexOf('XB') !== -1 ? population - I0 : population, 
            U2: lieuInitialisation.indexOf('XB') !== -1 ? I0 : 0, 
            P2: 0, RU2 :0, RP2 : 0, 
            S3: lieuInitialisation.indexOf('YA') !== -1? population - I0 : population, 
            U3: lieuInitialisation.indexOf('YA') !== -1 ? I0 : 0, 
            P3: 0, RU3 :0, RP3 : 0, 
            S4: lieuInitialisation.indexOf('YB') !== -1 ? population - I0 : population, 
            U4: lieuInitialisation.indexOf('YB') !== -1 ? I0 : 0, 
            P4: 0, RU4 :0, RP4 : 0, 
            XA:0.5, XB:0.5,YA:0.5,YB:0.5
        };
        res.status(200).json({'epidemie' : epidemie_, 'experience': experience, 'frame': frame})
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse d'erreur
        console.log(error);
        res.status(500).json({ error: error });
      }
}

export const play = async (req, res) => {
    const experienceId = req.body.frame.experience;
    // Recherchez l'élément par son ID dans la base de données
    try { 
        // J'ENREGISTRE LA FRAME QUI VIENS D'ETRE CONFIRME AVEC LES TESTS FINAUX 
        await frameModel.create({
            ...req.body.frame, _id: undefined
        })
        // UPDATE DUREE EXPERIENCE
        const experienceToUpdate = await experienceModel.findById(experienceId);
        if (!experienceToUpdate) {
          console.log(`l'id : ${experienceId} n'a pas trouvé de correspondance dans la BDD`);
          return res.status(404).json({ message: 'Élément non trouvé.' });
        }
        experienceToUpdate.t += 1 
        await experienceToUpdate.save()

        // FRAME STUFF 
        const demainData = nextDay(req.body.frame, experienceToUpdate.migration, req.body.epidemie.R, req.body.epidemie.DD); 
        const newData = {...demainData, 
            t : req.body.frame.t + 1, 
            experience: experienceToUpdate._id, 
            XA: req.body.frame.XA , 
            XB: req.body.frame.XB, 
            YA: req.body.frame.YA, 
            YB: req.body.frame.YB};
        
        return res.status(200).send({ ... newData});

        } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'élément :', error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour de l\'élément.' });
    }
};