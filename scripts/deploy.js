async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ProofDrop = await ethers.getContractFactory("ProofDrop");
  const proofDrop = await ProofDrop.deploy();

  await proofDrop.deployed();
  console.log("ProofDrop deployed to:", proofDrop.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
