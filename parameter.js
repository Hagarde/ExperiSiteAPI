export const population = 1000000; 
export const I0 = 50; 

export const alpha = 1; // C'est l'accumulation de connaisasnce et structurelle qui augmente l'efficacité ==> apha = 2 ==> 100 tests ont l'effet de 10 000 
export const psi = 1 ; // C'est la connaissance des symptôme car plus c'est petit plus grande sera la probabilité qu'un test soit positif car le patient dait un peu avant
export const pas = Math.pow(10,-2); // purement technique : le nombre de pas à faire pour calculer l'évolution de l'épidémie pdt un jour plus c'est petit plus c'est précis mais long 
export const pi = 1 ; // C'est l'efficacité d'un isolement si 1 alors si tu t'isoles alors plus de transmission 
export const condition_seuil = 0.00001;
export const epsilon = 0.1; // C'est la proportion de personne testée chaque jour 