import {pi, alpha, psi, condition_seuil as condition, pas, population, epsilon} from '../parameter.js'

function demain(data,etat_front,R,DD){
    const nmbrPas = 1 / pas ; // Nombre d'étapes que nous allons devoir faire
    let result = {...data}
    for (let i=0 ; i < nmbrPas ;i++ ) { // On ajoute l'évolution de 1 pas nmbrPas fois pour avoir l'évolution au bout d'1 jour
        result = sumDictionaries(result,evol1Pas(result,R,DD,etat_front));
    }
    return result
}

function evol1Pas(data, R, DD, etat_frontiere) {
    const beta = (R*pas) / (population * DD) // beta = R/(NN*DD) par définition et le pas permet de convertir en beta par unité de pas
    const betas = {'libre' : {
            beta_soi: beta * (6/10), 
            beta_inter: beta * (1/10), 
            beta_intra : beta * (2/10)
        },
        'ferme' : {
            beta_intra : 0,
            beta_inter : 0,
            beta_soi : beta
        }, 
        'AB' : {
            beta_intra : beta * (5/100),
            beta_inter : beta * (25/1000),
            beta_soi : beta * (9/10)
        }, 
        'XY' : {
            beta_inter : beta * (5/100),
            beta_intra : beta * (25/1000),
            beta_soi : beta * (9/10)
        }
    };

    // Calcul du nombre de personnes de chaque région et population infectée par des étrangers à sa région et population 

    const inf_inter_regionale1 = ((betas[etat_frontiere].beta_intra * data.U2) + betas[etat_frontiere].beta_inter *(data.U3 +  data.U4))* data.S1 
    const inf_inter_regionale2 = ((betas[etat_frontiere].beta_intra * data.U1) + betas[etat_frontiere].beta_inter *(data.U3 + data.U4))* data.S2
    const inf_inter_regionale3 = ((betas[etat_frontiere].beta_intra * data.U4) + betas[etat_frontiere].beta_inter *(data.U1 + data.U2))* data.S3
    const inf_inter_regionale4 = ((betas[etat_frontiere].beta_intra * data.U3) + betas[etat_frontiere].beta_inter *(data.U1 + data.U2))* data.S4

    // Calcul des variations pour un pas 

    const region1 = calculateRegion(data.S1,data.U1,data.P1,data.RU1,data.XA,betas[etat_frontiere].beta_soi,inf_inter_regionale1, DD);
    const region2 = calculateRegion(data.S2,data.U2,data.P2,data.RU2,data.XB,betas[etat_frontiere].beta_soi,inf_inter_regionale2, DD);
    const region3= calculateRegion(data.S3,data.U3,data.P3,data.RU3,data.YA,betas[etat_frontiere].beta_soi,inf_inter_regionale3,  DD);
    const region4 = calculateRegion(data.S4,data.U4,data.P4,data.RU4,data.YB,betas[etat_frontiere].beta_soi,inf_inter_regionale4, DD);
    
    return {
        'U1': region1.dU,
        'S1' : region1.dS,
        'P1': region1.dP,
        'RU1' :region1.dRU,
        'RP1': region1.dRP,
        'S2': region2.dS,
        'U2': region2.dU,
        'P2': region2.dP,
        'RU2':region2.dRU,
        'RP2':region2.dRP,
        'S3': region3.dS,
        'U3': region3.dU,
        'P3': region3.dP,
        'RU3': region3.dRU,
        'RP3': region3.dRP,
        'S4': region4.dS,
        'U4': region4.dU,
        'P4': region4.dP,
        'RU4': region4.dRU,
        'RP4': region4.dRP
    }
}

function calculateRegion(S, U, P, RU, nmbr_test, beta_soi, inf_inter_regionale, DD) {
  
    //if (U < 0.01 && inf_inter_regionale < condition*pas) {console.log("L'épidémie est finie");}

    const dRU_ = (U * pas)  / DD; // * pas permet de convertir DD en duree de maladie en unité de pas
    const dRP_ = (P * pas) / DD; // * pas permet de convertir DD en duree de maladie en unité de pas

    const nmbr_test_reel = Math.pow(nmbr_test*epsilon*population, alpha) * pas // On s'intéresse au nombre réel de test pq alpha traduit que plus on fait de test plus c'est probable de tombé sur les bon, effet connaissance 
    const infection = beta_soi * S * (U + (1 - pi) * P);
    const prblUP = (Math.pow(U / (U + S + RU), psi)); // C'ets la probabilité que le test soit effectué sur une personne positive ==> psi permet d'augmenter cette prbl car on ne teste pas au hasard 
    const teste_positif = nmbr_test_reel * prblUP;

    const dS_ = - infection - inf_inter_regionale;
    const dU_ = infection - dRU_ - teste_positif + inf_inter_regionale;
    const dP_ = teste_positif - dRP_;
  
    if (teste_positif > nmbr_test_reel) {
        result.dP = nmbr_test_reel - P / DD;
        result.dU = -result.dS - U / DD + nmbr_test_reel;
    }
    return {dS: dS_, dU: dU_, dP: dP_, dRU:dRU_, dRP:dRP_};
}

function sumDictionaries(a, b) {
    const sumResult = { ...a }; 
    for (const key in a) {
      if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
        sumResult[key] += b[key];
      }
    }  
    return sumResult;
}

export default demain;