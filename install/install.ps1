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

function mupenconfig {
    #mupen-config
    #ruby util/gentranslation.rb > config/keysym-translation.json
    #ruby util/genmupencfg.rb > config/mupen64plus.cfg
}

function build {
    #build
    mupenconfig
    docker compose --file ../docker-compose.yml build
}

function run {
    docker compose --file ../docker-compose.yml up 
}

function stop {
    docker compose --file ../docker-compose.yml down
}

function rm {
    docker compose --file ../docker-compose.yml rm
}

#Emulate makefile functionality by allowing the user to execute individual functions such as "build" and "runall"
#Powershell will not allow for a dash character inside a function name, so all "modes" are the same as in the original
#Makefile but the dash is removed.
if ($Args[0]) {
    &($Args[0])
    exit
}

run
