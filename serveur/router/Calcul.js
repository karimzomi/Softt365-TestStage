const Express = require("express")
const router = Express.Router()

router.post("/CalculFondsPropre",(req,res)=>{
    const bodyReq = req.body
    const montantEmprunterNet = bodyReq.montantEmprunterNet
    const montantAchat = bodyReq.montantAchat
    let frais = bodyReq.frais ? bodyReq.frais : 0;

    if (montantAchat > 50000 && frais === 0) frais = montantAchat * 0.1;
    const montantEmprunterBrute = montantEmprunterNet/1.02

    const fonds = (montantAchat+frais - montantEmprunterBrute).toFixed(2)

    res.send({
        fonds
    }).status(200)

})
router.post("/Calcul", (req, res) => {
    const bodyReq = req.body

    let montantEmprunterBrute = 0 ;
    let montantEmprunterNet = 0;
    let frais = bodyReq.frais ? bodyReq.frais : 0;
    let duree = bodyReq.duree
    const tauxAnnuel = bodyReq.tauxAnnuel / 100

    //Calcul de montant
    if (bodyReq.montant > 50000 && frais === 0) frais = bodyReq.montant * 0.1;
    montantEmprunterBrute = bodyReq.montant + frais - bodyReq.fonds

    montantEmprunterNet = montantEmprunterBrute * 1.02
    //Calcul de Taux d'intérét et Mensualité

    let tauxMensuel = (Math.pow((1 + tauxAnnuel), (1 / 12)) - 1)
    tauxMensuel = Number.parseFloat(tauxMensuel.toFixed(5)) // Ex: 0.001973 -> 0.00198 (0.198%)

    let mensualite = (montantEmprunterNet * tauxMensuel * Math.pow(1 + tauxMensuel, duree)) / (Math.pow(1 + tauxMensuel, duree) - 1)
    mensualite = Number.parseFloat(mensualite.toFixed(2))
    /***************************************************************************/

    let resultat = []
    let soldeDebut = montantEmprunterNet
    for (let i = 0; i < duree; i++) {
        const interet = (soldeDebut * tauxMensuel).toFixed(2)
        const capitalRembourse = (mensualite - interet).toFixed(2)
        const soldeFin = (soldeDebut - capitalRembourse).toFixed(2)

        resultat.push({
            soldeDebut,
            mensualite,
            interet,
            capitalRembourse,
            soldeFin
        })
        soldeDebut = soldeFin
    }
    res.send({
        montantEmprunterNet,
        resultat    
    }).status(200)

})

module.exports = router;