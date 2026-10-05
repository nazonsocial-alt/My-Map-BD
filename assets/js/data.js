/* 64 districts, 8 divisions. "Name@row,col" places each tile on a geographic hex cartogram. */
const RAW={
Dhaka:"Dhaka@5,5|Gazipur@4,5|Narayanganj@5,6|Narsingdi@4,6|Munshiganj@5,4|Manikganj@4,4|Tangail@3,3|Kishoreganj@3,5|Faridpur@6,3|Gopalganj@7,3|Madaripur@6,4|Rajbari@5,3|Shariatpur@6,5",
Chattogram:"Chattogram@8,7|Cox's Bazar@10,7|Cumilla@5,7|Feni@6,7|Noakhali@7,6|Lakshmipur@7,5|Chandpur@6,6|Brahmanbaria@4,7|Rangamati@7,7|Khagrachhari@6,8|Bandarban@9,7",
Rajshahi:"Rajshahi@4,1|Bogura@3,1|Joypurhat@2,1|Naogaon@3,0|Natore@4,2|Chapainawabganj@4,0|Pabna@4,3|Sirajganj@3,2",
Khulna:"Khulna@8,1|Bagerhat@8,2|Satkhira@8,0|Jashore@7,1|Narail@7,2|Magura@6,2|Jhenaidah@6,1|Kushtia@5,2|Chuadanga@5,1|Meherpur@5,0",
Barishal:"Barishal@7,4|Bhola@8,5|Jhalokathi@8,4|Patuakhali@9,4|Pirojpur@8,3|Barguna@9,3",
Sylhet:"Sylhet@2,8|Moulvibazar@3,7|Habiganj@3,6|Sunamganj@2,7",
Rangpur:"Rangpur@2,2|Dinajpur@1,1|Thakurgaon@0,1|Panchagarh@0,2|Nilphamari@1,2|Lalmonirhat@1,3|Kurigram@1,4|Gaibandha@2,3",
Mymensingh:"Mymensingh@3,4|Jamalpur@2,4|Netrokona@2,6|Sherpur@2,5"};
const DIVS=Object.keys(RAW),D=[];
for(const dv of DIVS)for(const s of RAW[dv].split('|')){const[n,p]=s.split('@'),[r,c]=p.split(',').map(Number);D.push({id:n.toLowerCase().replace(/\W/g,''),n,dv,r,c})}
D.sort((a,b)=>a.n.localeCompare(b.n));
