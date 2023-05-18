<#
    Command structure from the makefile
        build:
            mupen-config
        run-all
            run
                .network
            run-proxies
                run-proxy
                .network
            run-novncs
                run-novnc
                .network
#>

<#
    Define the name variables that are needed to properly
    name and link all containers to each other
#>
$IMAGE_NAME_BASE = "mupen64plus-x11vnc"

$SERVER_IMAGE_NAME= $IMAGE_NAME_BASE + ":server"
$CLIENT_IMAGE_NAME= $IMAGE_NAME_BASE + ":client"
$NOVNC_IMAGE_NAME= $IMAGE_NAME_BASE + ":novnc"

$NETWORK_NAME= $IMAGE_NAME_BASE + "-net"

$SERVER_CONTAINER_NAME= $IMAGE_NAME_BASE + "-server"
$CLIENT_CONTAINER_NAME= $IMAGE_NAME_BASE + "-client"
$NOVNC_CONTAINER_NAME= $IMAGE_NAME_BASE+ "-novnc"

$SERVER= $SERVER_CONTAINER_NAME

$vnc_port = 5900
$novnc_port = 8000
$curr_pln = 1

if ($Args[0]) {
    &($Args[0])
    exit
}

function network {
    #.network
    docker network create $NETWORK_NAME
    #New-Item .network
}

function mupenconfig {
    #mupen-config
    #ruby util/gentranslation.rb > config/keysym-translation.json
    #ruby util/genmupencfg.rb > config/mupen64plus.cfg
}

function build {
    #build
    mupenconfig

    docker build -t $SERVER_IMAGE_NAME .. -f Dockerfile.server
    docker build -t $CLIENT_IMAGE_NAME .. -f Dockerfile.client
    docker build -t $NOVNC_IMAGE_NAME .. -f Dockerfile.novnc
}
#end of initial build phase
#start of execution phase
function runproxies {
    #run-proxies (I.E. run-proxy in a for loop)
    for ($curr_pln=1; $curr_pln -le 4; $curr_pln++) {
        docker run -d -p ($vnc_port+$curr_pln):($vnc_port+$curr_pln) --net $NETWORK_NAME --privileged -e "$SERVER" -e "$curr_pln" --name $CLIENT_CONTAINER_NAME-proxy-$curr_pln $CLIENT_IMAGE_NAME
    }}

function runnovncs {
#run-novncs (I.E. run-novncs in a for loop)
for ($curr_pln=1; $curr_pln -le 4; $i++) {
    docker run -d -p ($novnc_port+$curr_pln):($novnc_port+$curr_pln) --net $(NETWORK_NAME) -e "SERVER=$CLIENT_CONTAINER_NAME-proxy-$curr_pln" -e "$curr_pln" --name $NOVNC_CONTAINER_NAME-$curr_pln $NOVNC_IMAGE_NAME
}}

function runall {
    #run
    docker run -d -p ($vnc_port):($vnc_port) --net $NETWORK_NAME --name $SERVER_CONTAINER_NAME $SERVER_IMAGE_NAME
    runproxies
    runnovncs
}

network
build
runall
